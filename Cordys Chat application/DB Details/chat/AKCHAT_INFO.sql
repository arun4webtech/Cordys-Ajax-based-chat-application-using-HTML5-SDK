--------------------------------------------------------
--  DDL for Table AKCHAT_INFO
--------------------------------------------------------

  CREATE TABLE "NIBANAUSER"."AKCHAT_INFO" 
   (	"REF_NO" NUMBER, 
	"PRIVATE_GROUP" NUMBER, 
	"HEADING" VARCHAR2(20 BYTE), 
	"CREATED_BY" NUMBER, 
	"CREATED_ON" TIMESTAMP (6)
   ) PCTFREE 10 PCTUSED 40 INITRANS 1 MAXTRANS 255 NOCOMPRESS LOGGING
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
  TABLESPACE "TB_NIBANADB" ;
--------------------------------------------------------
--  DDL for Index AKCHAT_INFO_PK
--------------------------------------------------------

  CREATE UNIQUE INDEX "NIBANAUSER"."AKCHAT_INFO_PK" ON "NIBANAUSER"."AKCHAT_INFO" ("REF_NO") 
  PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
  TABLESPACE "TB_NIBANADB" ;
--------------------------------------------------------
--  Constraints for Table AKCHAT_INFO
--------------------------------------------------------

  ALTER TABLE "NIBANAUSER"."AKCHAT_INFO" ADD CONSTRAINT "AKCHAT_INFO_PK" PRIMARY KEY ("REF_NO")
  USING INDEX PCTFREE 10 INITRANS 2 MAXTRANS 255 COMPUTE STATISTICS 
  STORAGE(INITIAL 65536 NEXT 1048576 MINEXTENTS 1 MAXEXTENTS 2147483645
  PCTINCREASE 0 FREELISTS 1 FREELIST GROUPS 1 BUFFER_POOL DEFAULT)
  TABLESPACE "TB_NIBANADB"  ENABLE;
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_INFO" MODIFY ("REF_NO" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_INFO" MODIFY ("PRIVATE_GROUP" NOT NULL ENABLE);
 
  ALTER TABLE "NIBANAUSER"."AKCHAT_INFO" MODIFY ("CREATED_ON" NOT NULL ENABLE);
--------------------------------------------------------
--  DDL for Trigger AKCHAT_INFO
--------------------------------------------------------

  CREATE OR REPLACE TRIGGER "NIBANAUSER"."AKCHAT_INFO" 
BEFORE INSERT ON AKCHAT_INFO 
 FOR EACH ROW BEGIN     
      IF inserting THEN       
        IF :NEW."REF_NO" IS NULL THEN          
          SELECT AKCHAT_INFO_SEQ.nextval 
              INTO :NEW."REF_NO" 
          FROM dual;       
        END IF;    
      END IF; 
    END;
/
ALTER TRIGGER "NIBANAUSER"."AKCHAT_INFO" ENABLE;
