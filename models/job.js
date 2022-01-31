"use strict";

const req = require("express/lib/request");
const db = require("../db");
const {BadRequest,NotFoundError,ExpressError} = require("../expressError");
const {sqlForPartialUpdate} = require("../helpers/sql");



class Job {
    static async create({title,salary,equity,company_handle}){
        const results = await db.query(`INSERT INTO jobs (title,salary,equity,company_handle)
         VALUES($1,$2,$3,$4)
         RETURNING title,salary,equity,company_handle
        `,
        [title,salary,equity,company_handle]);
        const jobs = results.rows[0];
        return jobs;
    }
   static async findAll(query){
       
      if(query.title !== undefined){
        
        const titleResults = await db.query(`
        SELECT title,salary,equity,company_handle
        FROM jobs
        WHERE LOWER(title) LIKE '%${query.title}%'
        `)
            return titleResults.rows;
        }
        
        if(query.minsalary !== undefined){
          query.minsalary = parseInt(query.minsalary);
        const minSalaryResults = await db.query(`
        SELECT title,salary,equity,company_handle
        FROM jobs
        WHERE salary >= $1
        `,[query.minsalary])
        return minSalaryResults.rows;
        }

        if(query.equity === true){
            equityResults = await db.query(`
            SELECT title,salary,equity,company_handle
            FROM jobs
            WHERE equity > 0
            `)
        }
       
        const jobsResults = await db.query(
            `
             SELECT id,title,salary,equity,company_handle
             FROM jobs
             ORDER BY title
            `
         )
         return jobsResults.rows;
    
       
   }
   static async get(id){
       const jobsResults = await db.query(
           `SELECT id,title,salary,equity,company_handle
           FROM jobs
           WHERE id=$1
           `,[id]
       )
       return jobsResults.rows[0];
   }

   static async remove(id){
       const result = await db.query(`
        DELETE
        FROM jobs
        WHERE id=$1
        Returning id
       `,[id])
       const job = result.rows[0];
       if(!job) throw new NotFoundError(`No job`)
   }

   static async update(handle, data) {
    const { setCols, values } = sqlForPartialUpdate(
        data,
        {
          company_handle: "companyHandle"
        });
    const handleVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE jobs
                      SET ${setCols} 
                      WHERE id = ${handleVarIdx} 
                      RETURNING title, 
                                salary, 
                                equity,
                                company_handle`;
    const result = await db.query(querySql, [...values, handle]);
    const job = result.rows[0];

    return job;
}
}

module.exports = Job;