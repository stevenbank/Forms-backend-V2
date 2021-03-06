const { CREATE_FORM, GET_ALL_FORMS, GET_ONE_FORM, DELETE_FORM, UPDATE_FORM } = require("../services/forms");
const logs = require('../services/logs');
const jwt = require('jsonwebtoken');

const create = async (req,res) => {
    const {auth_token,data,title,desc,theme,istest,duration,ans_key} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {user_id} = await jwt.verify(auth_token,process.env.JWT_KEY);
    const info = `creating forms for user with user_id ${user_id}`;
    let status = '';

    try {

        const create_form_res = await CREATE_FORM({user_id,data,title,desc,theme,istest,duration,ans_key});

        if(create_form_res.status){

            status = `form with form_id ${create_form_res.msg.form_id} for user with user_id ${create_form_res.msg.user_id}`;
            logs.add_log(ip,endpoint,info,status);
            return res.json({
                status:true
            });

        }else{
            status = `operation failed with error ${JSON.stringify(create_form_res)}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).json(create_form_res);
        }
        
    } catch (error) {

        status = `operation failed with error ${JSON.stringify(error)}`;
        logs.add_log(ip,endpoint,info,status);
        return res.status(500).json(error);
        
    }
}

const getall = async (req,res)=>{
    const {auth_token} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {user_id} = await jwt.verify(auth_token,process.env.JWT_KEY);
    const info = `fetching forms for user with user_id ${user_id}`;
    let status = '';
    
    try {

        const get_all_res = await GET_ALL_FORMS({user_id});
        if(get_all_res.status){

            status=`sent all form created by user with user_id : ${user_id}`;
            logs.add_log(ip,endpoint,info,status);
            return res.json(get_all_res.msg);

        }else{
            status=`operation failed with message: ${get_all_res.msg.message}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).json(get_all_res.msg);
        }
        
    } catch (error) {
        status=`operation failed with error ${JSON.stringify(error)}`;
        logs.add_log(ip,endpoint,info,status);
        return res.status(500).json(error);
    }
}

const getone = async (req,res)=>{

    const {auth_token,form_id} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {user_id} = await jwt.verify(auth_token,process.env.JWT_KEY);
    const info = `fetching forms with form_id : ${form_id} for user with user_id ${user_id}`;
    let status = '';

    try {

        const get_form_data = await GET_ONE_FORM({form_id});


        if(get_form_data.status){

        // console.log(get_form_data);

            status=`sent form ${form_id} to  user : ${user_id}`;
            logs.add_log(ip,endpoint,info,status);
            return res.json(get_form_data.msg);

        }else{
            status=`operation failed with message: ${get_form_data.msg.message}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).json(get_form_data.msg);
        }
        
    } catch (error) {
        console.log(error);
        status=`operation failed with error ${JSON.stringify(error)}`;
        logs.add_log(ip,endpoint,info,status);
        return res.status(500).json(error);
    }

}

const delone = async (req,res)=>{

    const {auth_token,form_id} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {user_id} = await jwt.verify(auth_token,process.env.JWT_KEY);
    const info = `deleting forms with form_id : ${form_id} for user with user_id ${user_id}`;
    let status = '';

    try {

        const delete_form_data = await DELETE_FORM(form_id);

        if(delete_form_data.status){

            status = `form : ${form_id} deleted by user : ${user_id}`;
            logs.add_log(ip,endpoint,info,status);
            return res.json(delete_form_data.msg);

        }else{
            status = `operation failed for form : ${form_id} with message : ${delete_form_data.msg.message}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).json(delete_form_data.msg);
        }
        
    } catch (error) {
        console.log(error);
        status = `operation failed with an error : ${JSON.stringify(error)}`;
        logs.add_log(ip,endpoint,info,status);
        return res.status(500).json(error);
    }

}

const updateone = async (req,res)=>{

    const {auth_token,form_id} = req.body;
    const ip = req.connection.remoteAddress;
    const endpoint = req.originalUrl;
    const {user_id} = await jwt.verify(auth_token,process.env.JWT_KEY);
    const info = `updating forms with form_id : ${form_id} for user with user_id ${user_id}`;
    let status = '';
    const form = req.formData;
    const data = req.body.data || JSON.parse(form.data);
    const title = req.body.title || form.title;
    const theme = req.body.theme || form.theme;
    const desc = req.body.desc || form.description;
    const istest = req.body.istest || form.istest;
    const duration = req.body.duration || form.duration;
    const ans_key = req.body.ans_key || JSON.parse(form.ans_key)

    // console.log(form.description);
    
    try {


        const update_result = await UPDATE_FORM({form_id,data,title,desc,theme,istest,duration,ans_key});

        if(update_result.status){
            status =`form with id : ${form_id} updated by user ${req.user.user_id}`;
            logs.add_log(ip,endpoint,info,status);
            return res.json(update_result);
        }else{
            status = `updating failed with message: ${update_result.msg.message} for form with id : ${form_id}`;
            logs.add_log(ip,endpoint,info,status);
            return res.status(500).json(update_result).send();
        }
        
    } catch (error) {
        console.log(error,"aman");
        status = `operation failed with an error ${JSON.stringify(error)}`;
        logs.add_log(ip,endpoint,info,status);
        return res.status(500).json(error);
        
    }

}

module.exports = { create,getall,getone,delone,updateone };