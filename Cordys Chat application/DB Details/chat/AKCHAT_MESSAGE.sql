--------------------------------------------------------
--  DDL for Table AKCHAT_MESSAGE
--------------------------------------------------------

  CREATE TABLE "NIBANAUSER"."AKCHAT_MESSAGE" 
   (	"REF_NO" NUMBER, 
	"INFO_REF_NO" NUMBER, 
	"USER_FROM" NUMBER, 
	"USER_TO" VARCHAR2(20 BYTE), 
	"MESSAGE" VARCHAR2(20 BYTE), 
	"STATUS" NUMBER, 
	"CREATED_ON" TIMESTAMP (6)
   ) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
  TABLESPACE "TB_NIBANADB" ;
--------------------------------------------------------
--  Constraints for Table AKCHAT_MESSAGE
--------------------------------------------------------

  ALTER TABLE "NIBANAUSER"."AKCHAT_MESSAGE" MODIFY ("REF_NO" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_MESSAGE" MODIFY ("INFO_REF_NO" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_MESSAGE" MODIFY ("USER_FROM" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_MESSAGE" MODIFY ("USER_TO" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_MESSAGE" MODIFY ("MESSAGE" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_MESSAGE" MODIFY ("STATUS" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_MESSAGE" MODIFY ("CREATED_ON" NOT NULL ENABLE);
--------------------------------------------------------
--  DDL for Trigger AKCHAT_MESSAGE
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "NIBANAUSER"."AKCHAT_MESSAGE" 
BEFORE INSERT ON AKCHAT_MESSAGE 
 FOR EACH ROW BEGIN     
      IF inserting THEN       
        IF :NEW."REF_NO" IS NULL THEN          
          SELECT AKCHAT_MESSAGE_SEQ.nextval 
              INTO :NEW."REF_NO" 
          FROM dual;       
        END IF;    
      END IF; 
    END;
/
ALTER TRIGGER "NIBANAUSER"."AKCHAT_MESSAGE" ENABLE;
