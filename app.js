const express = require("express");
const app = express();
const ourdate = require(__dirname+"/MyDate.js");
const mongoose = require("mongoose");
const _ =require('lodash');

var day = ourdate.myDate();

app.use(express.urlencoded({extended:true}));
app.set('view engine','ejs');

app.use(express.static("public"));

// Database
mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser:true});

// Schema
const itemSchema = new mongoose.Schema({
    itemName : String
});

// Model and collection name Item
const ItemModel = mongoose.model("Item",itemSchema);

// Creating some documents
const item1 = new ItemModel({
    itemName:"Welcome to TODOLIST !"
});

const item2 = new ItemModel({
    itemName:"Hit + button to add new item!"
});

const item3 = new ItemModel({
    itemName:"Tick the box to remove item!"
});

const defaultItems = [item1,item2,item3];

app.get("/",function(req,res)
{
    // var today = new Date();
    // var dayNo = today.getDay();

    day = ourdate.myDay();

    ItemModel.find({},function(err,foundItems)
    {
        if(foundItems.length===0)
        {
         // Inserting in collection
            ItemModel.insertMany(defaultItems,function(err){
                if(err)
                console.log("Yaha aaya error : "+err);
                else
                console.log("Success!");
            });
            res.redirect("/");
        }
        else
        {
            res.render("list",{kindOfDay:day,newListItem:foundItems});            
        }
    });
});

app.post("/",function(req,res)
{
    const item = req.body.newItem;
    const listName = req.body.button;

    console.log(item);
    console.log(listName);
    
    const newItem = new ItemModel({
        itemName: item
    });

    if(listName===day)
    {
        newItem.save();
        res.redirect("/");
    }
    else
    {
        List.findOne({name:listName},function(err,foundList)
        {
            foundList.items.push(newItem);
            foundList.save();
            res.redirect("/"+listName);
        });
    }
});

app.post("/delete",function(req,res)
{
    const checkedItemId = req.body.checkbox;
    const listName = req.body.listName;

    if(listName===day)
    {
        ItemModel.deleteOne({_id:checkedItemId},function(err)
        {
            if(err)
            console.log(err);
            else
            console.log(checkedItemId+" deleted !");
            res.redirect("/");
        });
    }
    else
    {
        List.findOneAndUpdate({name:listName},
            {$pull:{items:{_id: checkedItemId}}},
            function(err,foundList){
                if(!err)
                {
                    res.redirect("/"+listName);
                }
            });
    }
});

// custom lists

const listSchema = new mongoose.Schema({
    name: String,
    items: [itemSchema]
});

const List = mongoose.model("List",listSchema);

app.get("/:customListName",function(req,res){
    const customListName =_.capitalize(req.params.customListName);

    console.log("Express route : "+req.params.customListName);

    // if(customListName=="Favicon.ico")
    // res.redirect("/");

    List.findOne({name:customListName},function(err, foundList)
    {
        if(!err)
        {
            if(!foundList)
            {
                console.log("creating new list of "+customListName);
                //create a new list
                const mylist = new List({
                    name: customListName,
                    items: defaultItems
                });
                mylist.save();
                res.redirect("/"+customListName);
            }
            else
            {
                console.log("Database me mila");
                // show an existing list
                res.render("list",{kindOfDay:customListName,newListItem:foundList.items})
            }
        }
        else
        console.log("Error aaya !");
    });


});

app.listen(process.env.PORT || 3000,function()
{
    console.log("Server started on 3000");
});