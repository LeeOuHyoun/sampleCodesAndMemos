import java.util.Map;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;

import matrix.db.Context;
import matrix.util.StringList;

public class MyPartTrigger_mxJPO {

    private static final String BUNDLE = "emxFrameworkStringResource";

    public MyPartTrigger_mxJPO(Context context, String[] args) throws Exception {
    }

    public int checkDelete(Context context, String[] args) throws Exception {
        DomainObject part = DomainObject.newInstance(context, args[0]);
        String relSpec = PropertyUtil.getSchemaProperty(context, "relationship_MyPartSpecification");
        String connected = part.getInfo(context, "from[" + relSpec + "]");
        if (!"TRUE".equalsIgnoreCase(connected)) {
            return 0;
        }
        return block(context, "emxFramework.MyPart.Msg.CannotDeleteConnected");
    }

    public int checkTitle(Context context, String[] args) throws Exception {
        if (!isMyPart(context, args[1])) {
            return 0;
        }
        String title = DomainObject.newInstance(context, args[0]).getInfo(context, "attribute[Title]");
        if (title != null && !title.trim().isEmpty()) {
            return 0;
        }
        return block(context, "emxFramework.MyPart.Msg.TitleRequired");
    }

    public int syncChildState(Context context, String[] args) throws Exception {
        if (!isMyPart(context, args[1])) {
            return 0;
        }
        DomainObject parent = DomainObject.newInstance(context, args[0]);
        String target = args[2];
        if (target == null || target.isEmpty()) {
            target = parent.getInfo(context, DomainConstants.SELECT_CURRENT);
        }

        StringList selects = new StringList();
        selects.add(DomainConstants.SELECT_ID);
        selects.add(DomainConstants.SELECT_CURRENT);
        String relChild = PropertyUtil.getSchemaProperty(context, "relationship_MyPartChild");
        String typeChild = PropertyUtil.getSchemaProperty(context, "type_MyPartItem");
        MapList children = parent.getRelatedObjects(context, relChild, typeChild, selects, null,
                false, true, (short) 1, null, null, 0);
        if (children.isEmpty()) {
            return 0;
        }

        ContextUtil.pushContext(context);
        try {
            for (Object row : children) {
                Map<?, ?> child = (Map<?, ?>) row;
                if (target.equals(child.get(DomainConstants.SELECT_CURRENT))) {
                    continue;
                }
                DomainObject.newInstance(context, (String) child.get(DomainConstants.SELECT_ID))
                        .setState(context, target);
            }
        } finally {
            ContextUtil.popContext(context);
        }
        return 0;
    }

    private boolean isMyPart(Context context, String type) throws Exception {
        return PropertyUtil.getSchemaProperty(context, "type_MyPart").equals(type);
    }

    private int block(Context context, String key) throws Exception {
        MqlUtil.mqlCommand(context, "notice $1", label(context, key));
        return 1;
    }

    private String label(Context context, String key) {
        try {
            String value = EnoviaResourceBundle.getProperty(context, BUNDLE, context.getLocale(), key);
            return value == null || value.isEmpty() ? key : value;
        } catch (Exception e) {
            return key;
        }
    }
}
