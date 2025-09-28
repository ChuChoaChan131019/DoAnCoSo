create database CaiBang CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
drop database CaiBang;
use CaiBang;


select * from Users;
create table Users
(
	ID_User int AUTO_INCREMENT primary key,
    UserName varchar(200) not null unique,
    Password varchar(255) not null,
    Email varchar(200) not null unique,
    DateCreate datetime not null default current_timestamp,
    RoleName enum('employer', 'candidate') not null
);

select * from Employer;

create table Employer
(
	ID_User int not null,
    ID_Employer varchar(6) primary key,
    Company_Name varchar(500),
    Company_Address varchar(500),
    Company_Email varchar(200) unique,
    Company_Desciption varchar(500),
    Company_Website varchar(500) unique, 
    Foreign key (ID_User) References Users(ID_User)
);
ALTER TABLE Employer 
ADD COLUMN Company_Logo VARCHAR(255) NULL;
ALTER TABLE Employer ADD Company_Phone VARCHAR(20);
ALTER TABLE Employer ADD Founded_Date DATE;

create table Candidate
(
	ID_User int not null,
    ID_Candidate varchar(6) primary key,
    FullName varchar(100) ,
    Address varchar(100),
    Phonenumber varchar(15),
    Resume_URL varchar(100),
    Foreign key (ID_User) References Users(ID_User)
);
ALTER TABLE Candidate MODIFY Resume_URL VARCHAR(255);
create table Category
(
	ID_Category varchar(6) primary key,
    Name_Category varchar(500) not null
);

create table Job
(
	ID_Job varchar(6) primary key,
    ID_Employer varchar(6),
    Name_Job varchar(500) not null,
    Job_Description varchar(500) not null,
    Job_Location varchar(500) not null,
    Experience varchar(500) not null,
    Salary decimal default 0,
    ID_Category varchar(6),
    Start_Date datetime not null,
    End_Date datetime not null,
    Job_Status enum("opened", "closed") default "opened",
    foreign key (ID_Employer) references Employer(ID_Employer),
	foreign key (ID_Category) references Category(ID_Category)
);

create table Application
(	
	ID_Job varchar(6),
    ID_Candidate varchar(6),
    Date_Applied datetime not null,
    Application_Status enum("pending", "rejected", "hired") default "pending",
    primary key(ID_Job, ID_Candidate),
    foreign key (ID_Job) references Job(ID_Job),
    foreign key (ID_Candidate) references Candidate(ID_Candidate)
);
