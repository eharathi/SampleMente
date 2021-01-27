

#postgres://bjfzqudgvoqhih:fef442491d92915ac88341408febd199fcab2227d25a4b49f2df3319f52c4649@ec2-52-202-185-87compute-1amazonawscom:5432/db0ub90g3jvpao


CREATE TABLE users (
	"name" varchar NOT NULL,
	loginid varchar NOT NULL,
	"password" varchar NOT NULL,
	accounttype numeric NOT NULL DEFAULT 0,
	CONSTRAINT users_pk PRIMARY KEY (loginid)
);
CREATE TABLE results (
	studentid varchar NOT NULL,
	cgpa numeric NOT NULL,
	attendence numeric NOT NULL DEFAULT 0,
	CONSTRAINT results_un UNIQUE (studentid),
	CONSTRAINT results_users_fk FOREIGN KEY (studentid) REFERENCES users(loginid)
);


INSERT INTO users ("name", loginid, "password", accounttype) VALUES('student1', 'iD1', 'student1', 0);

INSERT INTO users ("name", loginid, "password", accounttype) VALUES('student2', 'iD2', 'student1', 0);

INSERT INTO users ("name", loginid, "password", accounttype) VALUES('student3', 'iD3', 'student1', 0);

INSERT INTO users ("name", loginid, "password", accounttype) VALUES('student4', 'iD4', 'student1', 0);


INSERT INTO users ("name", loginid, "password", accounttype) VALUES('master', 'm1', 'master1', 1);
INSERT INTO users ("name", loginid, "password", accounttype) VALUES('master2', 'm2', 'master2', 1);

INSERT INTO results(studentid, cgpa, attendence)VALUES('iD1', 73, 73);
INSERT INTO results(studentid, cgpa, attendence)VALUES('iD2', 8, 60);
INSERT INTO results(studentid, cgpa, attendence)VALUES('iD3', 5, 99);
