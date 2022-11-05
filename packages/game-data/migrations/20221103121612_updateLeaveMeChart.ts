import { Knex } from "knex";

const notes = `001000
000000
000100
000000
000000
010000
010000
000010
,     
000000
010000
000000
000010
000000
001000
000010
100000
,     
000010
001000
000100
000000
000000
100000
000100
001000
,     
000000
000010
000000
001000
000000
000001
010000
000000
,     
000010
001000
000100
000000
000000
010000
000100
100000
,     
000000
000010
000000
010000
000001
001000
000100
010000
,     
000010
000000
000010
001000
000000
001000
001000
000001
,     
000000
100000
001000
000010
000000
010000
000001
000000
,     
100100
001010
010001
010100
,     
001001
000000
010010
000000
101000
000000
010010
000010
,     
100010
010001
000101
100100
,     
001001
100100
010010
100001
,     
101000
000100
101000
000010
101000
000001
101000
000100
,     
000101
010000
000101
001000
000101
100000
000101
010000
,     
000010
001000
000001
100000
000100
010000
000010
001000
000001
010000
000100
010000
000010
001000
000001
100000
,     
000000
000000
000000
010000
000000
000010
001000
000000
,     
100000
000000
000000
000000
000000
000000
100000
000000
000000
000000
000000
000000
100000
000000
000000
000000
100000
000000
000000
000000
000000
100000
000000
000000
,     
100000
000000
000000
000000
000000
000000
100000
000000
000000
000000
000000
000000
100000
000000
000000
000000
100000
000000
000000
000000
000000
100000
000000
000000
,     
100000
000000
000000
000000
000000
000000
100000
000000
000000
000000
000000
000000
100000
000000
000000
000000
100000
000000
000000
000000
000000
100000
000000
000000
,     
000000
000000
000000
100000
000000
000000
100000
000000
000000
000000
000000
000000
100000
000000
000000
000000
100000
000000
000000
000000
000000
100000
000000
000000
,     
000001
000000
000000
000000
000000
000000
000001
000000
000000
000000
000000
000000
100000
000000
000000
000000
100000
000000
000000
000000
000000
100000
000000
000000
,     
000100
000000
000000
000000
000000
000000
000100
000000
000000
000000
000000
000000
100000
000000
000000
000000
100000
000000
000000
000000
000000
100000
000000
000000
,     
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
000000
,     
001100
000000
000000
000000
,     
010000
000000
000100
000000
010000
000000
000100
000000
010000
000000
000001
001000
000000
000001
001000
000000
,     
010000
000000
000100
000000
010000
000000
000100
000000
010000
000000
000001
001000
000000
000001
001000
000000
,     
010000
000000
000100
000000
010000
000000
000100
000000
010000
000000
000001
001000
000000
000001
001000
000000
,     
000000
000000
100000
000000
000100
000000
010000
000000
000100
000000
001000
000010
000000
001000
000010
000000
,     
011000
000000
000010
000000
011000
000000
000010
000000
011000
000000
000001
101000
000000
000001
101000
000000
,     
000010
000000
010000
000000
000010
000000
010000
000000
000100
000000
011000
000001
000000
011000
000001
000000
,     
100000
000000
000010
000000
100000
000000
000010
000000
100000
000000
000011
010000
000000
000011
001000
000000
, // b
000000
000000
000000
010000
000000
000010
001000
000000
,     
000100
000000
000000
000000
010000
000000
000000
000000
000100
000000
001000
000100
010000
000000
000010
000000
,     
001000
000000
000100
010000
000001
000000
001000
000000
000001
000000
100000
000000
000100
000000
010000
000001
,     
001000
000000
000010
000000
100000
000000
000001
001000
000010
000000
001000
000010
100000
000000
000001
000000
,     
000000
000000
010000
000000
000010
000000
001000
000000
000001
000000
001000
000010
100000
000000
000001
001000
,     
000010
000000
000000
000000
100100
000000
000000
000000
001001
000000
001000
000010
100000
000000
010010
000000
,     
000010
000000
001000
000000
000001
000000
010000
000010
100000
000000
000001
000000
010000
000000
000010
000000
,     
100000
000000
000100
000000
010000
000000
000100
000000
010000
000010
000000
010000
000010
000000
100001
000000
,     
000000
100000
001000
000010
000000
010000
000100
000000
,     
100001
000000
000000
000000
010000
000100
001000
000001
100000
000000
000010
000000
000000
000000
010000
000100
,     
001000
000000
000010
000000
100000
000000
000001
000000
010000
000000
000100
100000
000001
000000
001000
000100
,     
100000
000000
000100
000000
001001
000000
010010
000000
100010
000000
101000
000000
001000
000000
001001
000000
,     
100000
000000
000001
000000
001000
000000
000010
010000
000001
000000
001000
000000
100100
000000
000000
000000
,     
100001
000000
000000
000000
001100
000000
000000
000000
000010
100000
000100
001000
000001
000000
010000
000000
,     
000001
100000
000100
000000
001000
000000
001001
000000
000100
000000
100010
000000
001000
000000
010001
000000
,     
100000
000000
000001
000000
100000
000000
000001
000000
100000
000101
000000
100000
000101
000000
010000
000000
,     
100001
000000
000000
000100
000000
000010
010000
000000
,     
010000
000010
100001
000100
010000
000010
100001
000100
,     
100000
000100
100001
001000
000010
010000
100001
000010
,     
010000
000010
100001
000100
001000
000010
100001
000010
,     
010000
000100
100001
000100
000010
010000
100001
000010
,     
001000
000010
100001
010000
000010
001000
100001
000100
,     
010000
000100
100001
001000
000100
010000
100001
001000
,     
000100
010000
100001
000010
001000
000100
100001
010000
,     
000100
010000
100001
000100
010000
000100
100001
000010
,     
001000
100000
000101
000010
010000
000001
101000
010000
,     
000100
010000
000011
000100
100000
000010
110000
001000
,     
000001
001000
000110
000001
010000
000010
011000
100000
,     
000010
010000
000101
001000
000010
001000
101000
000010
,     
100000
000100
010001
001000
000100
010000
001010
000100
,     
001000
000010
010100
000001
001000
000010
010100
000001
,     
001000
000010
010001
000100
100000
000100
010010
001000
,     
000001
010000
001001
000010
010000
000001
100100
000010
,     
001000
000000
000010
000000
010000
000000
000010
000000
001000
000000
000100
010000
000000
000100
010000
000000
,     
000010
000000
100000
000000
000010
000000
001000
000000
000100
000000
010000
000010
000000
010000
000010
000000
,     
001000
000000
000100
000000
010000
000000
000010
000000
100000
000000
000001
001000
000000
000001
001000
000000
,     
000010
000000
010000
000000
000100
000000
010000
000000
000001
000000
010000
000100
000000
010000
000100
000000
,     
010000
000000
000001
000000
001000
000000
000010
000000
001000
000000
000010
010000
000000
000010
010000
000000
,     
000100
000000
010000
000000
000100
000000
100000
000000
000001
000000
001000
000100
000000
001000
000100
000000
,     
010000
000000
000010
000000
001000
000000
000001
000000
010000
000000
000100
100000
000000
000100
100000
000000
,     
000010
000000
010000
000000
000001
000000
001000
000000
000100
000000
100000
000010
000000
100000
000010
000000
,     
001000
000000
000101
000000
010000
000000
000110
000000
001000
000000
000001
101000
000000
000001
101000
000000
,     
000010
000000
011000
000000
000100
000000
110000
000000
000010
000000
010000
000110
000000
010000
000110
000000
,     
000100
000000
110000
000000
000010
000000
101000
000000
000001
000000
010000
000101
000000
010000
000101
000000
,     
000001
000000
101000
000000
000010
000000
011000
000000
000100
000000
100000
000110
000000
010000
000110
000000
,     
010000
000000
000010
000000
001000
000000
000110
000000
010000
000000
000010
011000
000000
000100
110000
000000
,     
000010
000000
001000
000000
000010
000000
101000
000000
000001
000000
010000
000110
000000
100000
000011
000000
,     
100000
000000
000010
000000
001000
000000
000001
000000
100000
000000
000010
011000
000000
000001
101000
000000
,     
000000
000000
000000
000010
000000
010000
000100
000000
,     
000000
000000
000000
000000
100000
000010
001000
000000
000100
010000
000010
000000
010000
000100
100000
000000
,     
000010
001000
000100
000000
010000
000010
100000
000000
000100
010000
000010
000000
001000
000010
100000
000000
,     
000100
010000
000010
000000
001000
000001
010000
000000
000100
100000
000010
000000
001000
000100
100000
000000
,     
000010
001000
000100
000000
010000
000010
100000
000000
000100
010000
000010
000000
100010
000000
000000
000000
,     
001001
000000
000000
000000
010000
000100
100000
000000
000010
001000
000100
000000
010000
000001
001000
000000
,     
000100
100000
000010
000000
001000
000100
100000
000000
000001
001000
000100
000000
010000
000100
001000
000000
,     
000100
001000
000010
000000
010000
000001
001000
000000
000010
100000
000001
000000
001000
000010
010000
000000
,     
010000
000000
000010
000100
001000
000000
100010
000000
010000
000000
001001
000000
000000
000000
001000
000000
,     
000010
001000
100100
000010
010000
000100
100010
001000
,     
000100
010000
001001
000100
010000
000010
001001
010000
,     
000100
010000
100010
000100
010000
000001
100100
100000
,     
000010
001000
010010
100000
000100
010000
001100
000010
,     
010000
000001
100010
001000
000100
010000
001001
100000
,     
000010
010000
001010
100000
000100
010000
001001
000010
,     
010000
000010
010100
000010
100000
000001
110000
000100
,     
010000
000001
001010
100000
000100
010000
001001
010000
,     
110001
000000
000000
000010
001000
000100
010000
000000
000000
000001
001000
000100
,     
010000
000000
000000
000100
010000
000010
100010
000000
000000
001001
000000
000000
,     
100101
000000
000000
010000
000010
001000
000001
000000
000000
010000
000100
100000
,     
000010
000000
000000
001000
000001
010000
000100
000000
000000
100010
000000
000000
,     
010110
000000
000000
010000
000010
001000
000100
000000
000000
100000
000010
010000
,     
000100
000000
000000
010000
000010
001000
001001
000000
000000
100010
000000
000000
,     
010101
000000
000000
000010
010000
001000
100000
000000
000000
000010
001000
000100
,     
100100
000000
000000
010000
000010
100000
100010
000000
000000
101001
000000
100000
,     
000000
000000
000000
100000
010000
001000
000101
000000
000000
000001
000010
001000
,     
110000
000000
000000
100000
001000
000010
011000
000000
000000
100101
000000
000000
,     
010101
000000
000000
100000
000100
100000
000011
000000
000000
000010
100000
000010
,     
011000
000000
000000
000100
010000
000100
000001
000000
000000
011010
000000
000000
,     
101001
000000
000000
010000
000001
010000
001000
000000
000000
000100
010000
000100
,     
000010
000000
000000
100000
000100
100000
000001
000000
000000
101001
000000
000000
,     
010110
100000
000100
100000
000010
001000
000001
010000
,     
000010
101000
000001
001010
010000
100100
000010
100101
,     
100111
000000
000000
000000`;

export async function up(knex: Knex) {
  return knex("charts").where("id", 5).update({
    notes,
  });
}

export async function down(knex: Knex): Promise<void> {
  // no-op
}
