/*
  This class has been generated by the Code Generator
*/

package com.chatmetadata;

import com.cordys.cpc.bsf.busobject.BusObjectConfig;
import com.cordys.cpc.bsf.busobject.BusObjectIterator;
import com.cordys.cpc.bsf.busobject.BusObject;
import com.cordys.cpc.bsf.busobject.QueryObject;
import com.cordys.cpc.bsf.busobject.DMLStatement;
import com.cordys.cpc.bsf.busobject.BSF;
import com.eibus.util.logger.CordysLogger;
import com.eibus.util.logger.Severity;
import java.util.Date;
import java.text.SimpleDateFormat;


public class AKChat extends AKChatBase
{
	private static CordysLogger logger = CordysLogger.getCordysLogger(AKChat.class);
    public AKChat()
    {
        this((BusObjectConfig)null);
    }

    public AKChat(BusObjectConfig config)
    {
        super(config);
    }
	public static String loggedUser()
	{
		String[] uservar = BSF.getUser().split(",");
   	 	String user_id = uservar[0].substring(3, uservar[0].length());
		return user_id;
	}
    public static BusObjectIterator<com.chatmetadata.AKChat> onlineStatus(int currentUser)
    {
		String queryText = 	" SELECT user_id, "+
							 " name, "+
							  " email, "+
							  " mobile, "+
							  " ( "+
							  " CASE SUBSTR(TO_CHAR(( "+
								  " (SELECT CURRENT_TIMESTAMP FROM dual "+
								  " )- checkout)),12,7) "+
								" WHEN '00:00:0' "+
								" THEN 'online' "+
								" ELSE 'offline' "+
							  " END) AS status,checkout last_in "+
							" FROM akchat_users where user_id !='"+currentUser+"'";
		QueryObject query = new QueryObject(queryText);
		query.setResultClass(AKChat.class);
   		query.setResultMapping(QueryObject.MAP_SPECIFIED, new String[][]{{"*","UserStatus"}});		
		return query.getObjects();
    }
	
    public static BusObjectIterator<com.chatmetadata.AKChat> getChat(String heading)
    {
   	 	String[] uservar = BSF.getUser().split(",");
   	 	String user_id = uservar[0].substring(3, uservar[0].length());
		
		DMLStatement dml;
		QueryObject queryObj;
		
		//logger.log(Severity.ERROR, "User :AK_Chat bsf :"+BSF.getUser()+" + bsf user_id :"+user_id);
		
		/** checking header is already present or not **/
		String queryText = 	"SELECT * FROM akchat_info where heading = '"+heading+"'";
		queryObj = new QueryObject(queryText);
		queryObj.setResultClass(AKChat.class);
   		queryObj.setResultMapping(QueryObject.MAP_SPECIFIED, new String[][]{{"*",null}});
		BusObject infoBO = queryObj.getObject();
		
		/** if header is not already present in DB **/
		if(infoBO == null)
		{
			/** creating header **/
			queryText = "insert into AKCHAT_INFO (PRIVATE_GROUP,HEADING,CREATED_BY,CREATED_ON) Values('1','"+heading+"','"+user_id+"','(SELECT CURRENT_TIMESTAMP FROM dual)')";
			//queryText = "insert into AKCHAT_INFO (PRIVATE_GROUP,HEADING,CREATED_BY,CREATED_ON) Values('1','"+heading+"','"+user_id+"','"+getTodaysDate()+"')";
			
			dml = new DMLStatement(queryText);
			dml.executeDML();
			
			
			/** Getting header ref no **/
			/*queryText = 	"SELECT * FROM akchat_info where heading = '"+heading+"'";
			queryObj = new QueryObject(queryText);
			queryObj.setResultClass(AKChat.class);
			queryObj.setResultMapping(QueryObject.MAP_SPECIFIED, new String[][]{{"*",null}});
			BusObject infoBO = queryObj.getObject();			
			String info_ref_no = infoBO.getStringProperty("REF_NO");
			
			queryText = "insert into AKCHAT_MESSAGE (INFO_REF_NO,USER_FROM,USER_TO,MESSAGE,STATUS,CREATED_ON) Values('"+info_ref_no+"','admin','admin','chat room created successfully, Now you can start making conversation..','admin','04-11-16')";
			dml = new DMLStatement(queryText);
			dml.executeDML();
			*/
			queryText = 	"SELECT * FROM akchat_info where heading = '"+heading+"'";
			queryObj = new QueryObject(queryText);
			queryObj.setResultClass(AKChat.class);
			queryObj.setResultMapping(QueryObject.MAP_SPECIFIED, new String[][]{{"*",null}});
			return queryObj.getObjects();
		}
		else  /** if header is already present in DB **/
		{
			/** making the user is in online **/
			/* -- moved to getNewChat function
			queryText = " UPDATE akchat_users "+
						" SET checkout = (SELECT CURRENT_TIMESTAMP FROM dual) "+
						" WHERE user_id = '"+user_id+"' ";
			dml = new DMLStatement(queryText);
			dml.executeDML();
			*/
			
			/** returning the newest data **/
			queryText = "WITH w_inf AS " +
						"  (SELECT ref_no " +
						"  FROM akchat_info t_inf " +
						"  WHERE t_inf.heading='"+heading+"' " +
						//"  AND rownum         = 1 " +
						"  ) " +
						"SELECT msg.*" +
						"FROM w_inf inf,akchat_message msg " +
						"where msg.info_ref_no = inf.ref_no " +
						"and rownum <=20";

			queryObj = new QueryObject(queryText);
			queryObj.setResultClass(AKChat.class);
			queryObj.setResultMapping(QueryObject.MAP_SPECIFIED, new String[][]{{"*",null}});
			return queryObj.getObjects();
		}	
    }	
	
	public static String getTodaysDate()
	{
		SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy' 'HH:mm:ss.SSSXXX");
		//SimpleDateFormat dateFormat = new SimpleDateFormat("dd-MM-yyyy");
		Date date = new Date();
		return dateFormat.format(date);
	}	

    public static void addNewMsg(int info_ref,String to_user,String msg)
    {
   	 	String[] uservar = BSF.getUser().split(",");
   	 	String user_id = uservar[0].substring(3, uservar[0].length());
		
		String queryText = 	"INSERT " +
							"INTO akchat_message " +
							"  ( " +
							"    INFO_REF_NO, " +
							"    USER_FROM, " +
							"    USER_TO, " +
							"    MESSAGE, " +
							"    STATUS, " +
							"    CREATED_ON " +
							"  ) " +
							"  VALUES " +
							"  ( " +
							"    '"+info_ref+"', " +
							"    '"+user_id+"', " +
							"    '"+to_user+"', " +
							"    '"+msg+"', " +
							"    '1', " +
							//"    '"+getTodaysDate()+"' " +
							"	(SELECT CURRENT_TIMESTAMP FROM dual)" +
							"  )";
		logger.log(Severity.ERROR, "Query addNewMsg 1"+queryText);
		DMLStatement dml = new DMLStatement(queryText);
		dml.executeDML();
    }
    public static BusObjectIterator<com.chatmetadata.AKChat> checkNewMsg(String Heading,int lastMsg)
    {
		/** making the user is in online **/
		DMLStatement dml;
		String queryText1 = " UPDATE akchat_users "+
					" SET checkout = (SELECT CURRENT_TIMESTAMP FROM dual) "+
					" WHERE user_id = '"+loggedUser()+"' ";
		dml = new DMLStatement(queryText1);
		dml.executeDML();
		
		String queryText = 	"SELECT msg.* " +
							"FROM akchat_message msg, " +
							"akchat_info info " +
							"WHERE msg.info_ref_no = info.ref_no " +
							"AND info.heading      = '"+Heading+"' " +
							"AND msg.ref_no        >"+lastMsg;
							
		//queryText = 	"SELECT * from akchat_message";
		//logger.log(Severity.ERROR, "Query akchat 4"+queryText);
		QueryObject query = new QueryObject(queryText);
		query.setResultClass(AKChat.class);
   		query.setResultMapping(QueryObject.MAP_SPECIFIED, new String[][]{{"*",null}});		
		return query.getObjects();
    }	

    public void onInsert()
    {
    }

    public void onUpdate()
    {
    }

    public void onDelete()
    {
    }

}
