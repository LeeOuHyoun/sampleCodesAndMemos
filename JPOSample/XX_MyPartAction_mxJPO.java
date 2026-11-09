import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.ContextUtil;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkException;
import com.matrixone.apps.domain.util.MqlUtil;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.Context;
import matrix.db.JPO;

public class XX_MyPartAction_mxJPO {

    private static final Logger LOG = LoggerFactory.getLogger(XX_MyPartAction_mxJPO.class);

    public XX_MyPartAction_mxJPO(Context context, String[] args) throws Exception {
    }

    public Map createDocumentForPart(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        String partId = (String) programMap.get("objectId");
        String title = (String) programMap.get("title");
        if (UIUtil.isNullOrEmpty(partId)) {
            throw new FrameworkException(EnoviaResourceBundle.getProperty(context, "emxMyAppStringResource",
                    context.getLocale(), "emxMyApp.Error.NoPart"));
        }
        String typeDocument = PropertyUtil.getSchemaProperty(context, "type_MyDocument");
        String relPartDocument = PropertyUtil.getSchemaProperty(context, "relationship_MyPartDocument");
        String attrTitle = PropertyUtil.getSchemaProperty(context, "attribute_Title");
        Map result = new HashMap();
        ContextUtil.startTransaction(context, true);
        try {
            DomainObject document = DomainObject.newInstance(context);
            document.createObject(context, typeDocument, null, null, null, null);
            document.setAttributeValue(context, attrTitle, title);
            DomainRelationship.connect(context, DomainObject.newInstance(context, partId), relPartDocument, document);
            ContextUtil.commitTransaction(context);
            result.put("id", document.getId(context));
        } catch (Exception e) {
            ContextUtil.abortTransaction(context);
            LOG.error("createDocumentForPart failed: " + partId, e);
            throw new FrameworkException(e);
        }
        MqlUtil.mqlCommand(context, "notice $1", EnoviaResourceBundle.getProperty(context, "emxMyAppStringResource",
                context.getLocale(), "emxMyApp.Message.DocumentCreated"));
        return result;
    }

    public void stampLastChecked(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        String objectId = (String) programMap.get("objectId");
        String checkedBy = context.getUser();
        String attrCheckedBy = PropertyUtil.getSchemaProperty(context, "attribute_MyCheckedBy");
        ContextUtil.pushContext(context);
        try {
            DomainObject.newInstance(context, objectId).setAttributeValue(context, attrCheckedBy, checkedBy);
        } finally {
            ContextUtil.popContext(context);
        }
    }

    public String getCurrentState(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        String objectId = (String) programMap.get("objectId");
        return MqlUtil.mqlCommand(context, "print bus $1 select $2 dump", objectId, "current");
    }
}
