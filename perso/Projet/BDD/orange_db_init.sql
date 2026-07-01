CREATE DATABASE IF NOT EXISTS orange_db;
USE orange_db;

-- Table 1
CREATE TABLE orange_avi_audio (
    uid INT NULL,
    name VARCHAR(50) NULL
);

-- Table 2
CREATE TABLE orange_avi_prefixe (
    uid INT AUTO_INCREMENT NOT NULL,
    id_profile INT NOT NULL,
    dnis VARCHAR(10) NOT NULL,
    sda VARCHAR(100) NOT NULL,
    campagne VARCHAR(50) NOT NULL,
    code_campagne INT NULL,
    customer VARCHAR(50) NULL,
    PRIMARY KEY (uid)
);

-- Table 3
CREATE TABLE orange_avi_profile (
    uid INT AUTO_INCREMENT NOT NULL,
    profile VARCHAR(50) NOT NULL,
    description VARCHAR(200) NULL,
    waiting_time INT NULL,
    audio_welcome VARCHAR(50) NULL,
    audio_waiting VARCHAR(50) NULL,
    audio_dissuasion VARCHAR(50) NULL,
    audio_closing VARCHAR(50) NULL,
    audio_flash VARCHAR(50) NULL,
    audio_exceptionnel VARCHAR(50) NULL,
    type_dissuasion VARCHAR(100) NULL,
    ch1_dissuasion VARCHAR(100) NULL,
    menu_actif INT NULL,
    barrage_entrant VARCHAR(100) NULL,
    PRIMARY KEY (uid)
);

-- Table 4
CREATE TABLE orange_avi_svi (
    uid INT AUTO_INCREMENT NOT NULL,
    id_profile INT NOT NULL,
    menu_0_action VARCHAR(50) NULL,
    menu_0_ch VARCHAR(50) NULL,
    menu_1_action VARCHAR(50) NULL,
    menu_1_ch VARCHAR(50) NULL,
    menu_2_action VARCHAR(50) NULL,
    menu_2_ch VARCHAR(50) NULL,
    menu_3_action VARCHAR(50) NULL,
    menu_3_ch VARCHAR(50) NULL,
    menu_4_action VARCHAR(50) NULL,
    menu_4_ch VARCHAR(50) NULL,
    menu_5_action VARCHAR(50) NULL,
    menu_5_ch VARCHAR(50) NULL,
    menu_diese_action VARCHAR(50) NULL,
    menu_diese_ch VARCHAR(50) NULL,
    menu_etoile_action VARCHAR(50) NULL,
    menu_etoile_ch VARCHAR(50) NULL,
    audio_svi VARCHAR(50) NULL,
    PRIMARY KEY (uid)
);

-- Table 5
CREATE TABLE orange_avi_svi2 (
    uid INT AUTO_INCREMENT NOT NULL,
    id_profile INT NOT NULL,
    menu_0_action VARCHAR(50) NULL,
    menu_0_ch VARCHAR(50) NULL,
    menu_1_action VARCHAR(50) NULL,
    menu_1_ch VARCHAR(50) NULL,
    menu_2_action VARCHAR(50) NULL,
    menu_2_ch VARCHAR(50) NULL,
    menu_3_action VARCHAR(50) NULL,
    menu_3_ch VARCHAR(50) NULL,
    menu_4_action VARCHAR(50) NULL,
    menu_4_ch VARCHAR(50) NULL,
    menu_5_action VARCHAR(50) NULL,
    menu_5_ch VARCHAR(50) NULL,
    menu_diese_action VARCHAR(50) NULL,
    menu_diese_ch VARCHAR(50) NULL,
    menu_etoile_action VARCHAR(50) NULL,
    menu_etoile_ch VARCHAR(50) NULL,
    audio_svi VARCHAR(50) NULL,
    PRIMARY KEY (uid)
);

-- Table 6
CREATE TABLE orange_avi_times (
    uid INT AUTO_INCREMENT NOT NULL,
    id_profile INT NOT NULL,
    day DATE NULL,
    dow INT NULL,
    opening_time VARCHAR(8) NOT NULL,
    closing_time VARCHAR(8) NOT NULL,
    PRIMARY KEY (uid)
);