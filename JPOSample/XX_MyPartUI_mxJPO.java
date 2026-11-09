import java.util.HashMap;
import java.util.Map;
import java.util.Vector;

import com.matrixone.apps.domain.DomainConstants;
import com.matrixone.apps.domain.DomainObject;
import com.matrixone.apps.domain.DomainRelationship;
import com.matrixone.apps.domain.util.EnoviaResourceBundle;
import com.matrixone.apps.domain.util.FrameworkUtil;
import com.matrixone.apps.domain.util.MapList;
import com.matrixone.apps.domain.util.PropertyUtil;
import com.matrixone.apps.framework.ui.UIUtil;

import matrix.db.Context;
import matrix.db.JPO;
import matrix.util.StringList;

public class XX_MyPartUI_mxJPO {

    private static final String SYM_TYPE_MY_PART = "type_MyPart";
    private static final String SYM_REL_MY_PART_DOCUMENT = "relationship_MyPartDocument";
    private static final String SYM_REL_MY_PART_STRUCTURE = "relationship_MyPartStructure";
    private static final String SYM_ATTR_MY_STATUS = "attribute_MyStatus";
    private static final String SYM_ATTR_MY_QUANTITY = "attribute_MyQuantity";

    public XX_MyPartUI_mxJPO(Context context, String[] args) throws Exception {
    }

    private static String schema(Context context, String symbolicName) throws Exception {
        return PropertyUtil.getSchemaProperty(context, symbolicName);
    }

    private static short toLevel(String expandLevel) {
        if ("All".equalsIgnoreCase(expandLevel)) {
            return 0;
        }
        if (UIUtil.isNullOrEmpty(expandLevel)) {
            return 1;
        }
        try {
            return Short.parseShort(expandLevel);
        } catch (NumberFormatException e) {
            return 1;
        }
    }

    @com.matrixone.apps.framework.ui.ProgramCallable
    public MapList getRelatedDocuments(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        String objectId = (String) programMap.get("objectId");
        StringList objectSelects = new StringList(DomainConstants.SELECT_ID);
        objectSelects.add(DomainConstants.SELECT_NAME);
        objectSelects.add(DomainConstants.SELECT_CURRENT);
        StringList relSelects = new StringList(DomainConstants.SELECT_RELATIONSHIP_ID);
        DomainObject part = DomainObject.newInstance(context, objectId);
        return part.getRelatedObjects(context, schema(context, SYM_REL_MY_PART_DOCUMENT), "*",
                objectSelects, relSelects, false, true, (short) 1, null, null, 0);
    }

    @com.matrixone.apps.framework.ui.ProgramCallable
    public MapList expandMyPartStructure(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        String objectId = (String) programMap.get("objectId");
        short level = toLevel((String) programMap.get("expandLevel"));
        DomainObject parent = DomainObject.newInstance(context, objectId);
        MapList children = parent.getRelatedObjects(context, schema(context, SYM_REL_MY_PART_STRUCTURE),
                schema(context, SYM_TYPE_MY_PART), new StringList(DomainConstants.SELECT_ID),
                new StringList(DomainConstants.SELECT_RELATIONSHIP_ID), false, true, level, null, null, 0);
        Map marker = new HashMap();
        marker.put("expandMultiLevelsJPO", "true");
        children.add(marker);
        return children;
    }

    public Vector getStatusColumn(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        MapList objectList = (MapList) programMap.get("objectList");
        Map paramList = (Map) programMap.get("paramList");
        Vector result = new Vector(objectList.size());
        if (objectList.isEmpty()) {
            return result;
        }
        String language = (String) paramList.get("languageStr");
        String[] ids = new String[objectList.size()];
        for (int i = 0; i < ids.length; i++) {
            ids[i] = (String) ((Map) objectList.get(i)).get(DomainConstants.SELECT_ID);
        }
        String attr = schema(context, SYM_ATTR_MY_STATUS);
        String select = DomainObject.getAttributeSelect(attr);
        MapList infoList = DomainObject.getInfo(context, ids, new StringList(select));
        for (Object o : infoList) {
            String value = (String) ((Map) o).get(select);
            result.add(UIUtil.isNullOrEmpty(value) ? ""
                    : EnoviaResourceBundle.getRangeI18NString(context, attr, value, language));
        }
        return result;
    }

    public Boolean canEditMyPart(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        String objectId = (String) programMap.get("objectId");
        if (UIUtil.isNullOrEmpty(objectId)) {
            return Boolean.FALSE;
        }
        String access = DomainObject.newInstance(context, objectId).getInfo(context, "current.access[modify]");
        return Boolean.valueOf("TRUE".equalsIgnoreCase(access));
    }

    public HashMap getStatusRange(Context context, String[] args) throws Exception {
        String attr = schema(context, SYM_ATTR_MY_STATUS);
        StringList choices = FrameworkUtil.getRanges(context, attr);
        StringList display = EnoviaResourceBundle.getAttrRangeI18NStringList(context, attr, choices,
                context.getSession().getLanguage());
        HashMap rangeMap = new HashMap();
        rangeMap.put("field_choices", choices);
        rangeMap.put("field_display_choices", display);
        return rangeMap;
    }

    public Boolean updateStatus(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        Map paramMap = (Map) programMap.get("paramMap");
        String objectId = (String) paramMap.get("objectId");
        String newValue = (String) paramMap.get("New Value");
        DomainObject.newInstance(context, objectId).setAttributeValue(context, schema(context, SYM_ATTR_MY_STATUS),
                newValue);
        return Boolean.TRUE;
    }

    public Boolean updateQuantity(Context context, String[] args) throws Exception {
        Map programMap = (Map) JPO.unpackArgs(args);
        Map paramMap = (Map) programMap.get("paramMap");
        String relId = (String) paramMap.get("relId");
        String newValue = (String) paramMap.get("New Value");
        DomainRelationship.setAttributeValue(context, relId, schema(context, SYM_ATTR_MY_QUANTITY), newValue);
        return Boolean.TRUE;
    }
}
