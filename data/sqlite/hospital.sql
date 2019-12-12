/*
 Navicat Premium Data Transfer

 Source Server         : bj-hospital-vis
 Source Server Type    : SQLite
 Source Server Version : 3012001
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3012001
 File Encoding         : 65001

 Date: 12/12/2019 11:55:42
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for hospital
-- ----------------------------
DROP TABLE IF EXISTS "hospital";
CREATE TABLE "hospital" (
  "code" integer NOT NULL,
  "name" text,
  "district" TEXT,
  "category" TEXT,
  "rank" TEXT,
  "address" TEXT,
  "postcode" TEXT,
  "desc" TEXT,
  "location" TEXT,
  "remark" TEXT,
  PRIMARY KEY ("code")
);

PRAGMA foreign_keys = true;
