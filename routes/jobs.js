"use strict";

/** Routes for jobs. */

const jsonschema = require("jsonschema");

const express = require("express");
const { ensureLoggedIn, checkAdmin, checkUserOrAdmin } = require("../middleware/auth");
const Job = require("../models/job");
const { BadRequestError } = require("../expressError");
const router = new express.Router();



router.post("/",checkAdmin, async function(req,res,next){
    try{
        const job = await Job.create(req.body);
        return res.status(201).json({job});
    }
    catch(err){
        return next(err);
    }
})

router.get("/", async function(req,res,next){
    try{
        let query = req.query;
        const jobs = await Job.findAll(query);
        return res.json({jobs});
    }
    catch(err){
        return next(err)
    }
})

router.get("/:id",async function (req,res,next){
    try{
        
        const job = await Job.get(req.params.id)
        console.log(job);
        return res.json({job});
    }
    catch(err){
        return next(err)
    }
})

router.patch("/:id", checkAdmin, async function(req,res,next){
    try{
        const job = await job.update(req.params.id,req.body)
    }
    catch(err){
        return next(err)
    }
})

router.delete("/:id", checkAdmin, async function(req,res,next){
    try{
        await Job.remove(req.params.id);
        return res.json({deleted: req.params.id})
    }
    catch(err){
        return next(err);
    }
})


module.exports = router;