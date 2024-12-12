// const User = require("../models/User")
const User = require("../models/User")
const router = require("express").Router();
const bcrypt = require("bcrypt");

router.put("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.user.isAdmin){
        if (req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            }
            catch(err){
                res.status(500).json({message: "Error generating salt"})
            }
        }

        try{
            const user = await User.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            });
            res.status(200).json({message: "Account hass been updated successfully"})
        }
        catch(err){
            res.status(500).json({message: "Error updating user"})
        }
    }
    else{
        return res.status(403).json("You can only update your own account");
    }
})

//delete users section 
router.delete("/:id", async(req,res)=>{
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json({message: "Account hass been deleted successfully"})
        }
        catch(err){
            res.status(500).json({message: "Error updating user"})
        }
    }
    else{
        return res.status(403).json("You can only delete your own account !");
    }
})

//get a user
router.get("/:id", async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc
        res.status(200).json(other);
    }
    catch(err){
        res.status(500).json(err);
    }
})

//follow a user
router.put("/:id/follow", async(req,res)=>{
    if(req.body.userId !== req.params.id ){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push: {followers: req.body.userId}});
                await currentUser.updateOne({$push: {followings: req.params.id}});
                res.status(200).json({message: "User has been followed :-)"})
            }
            else{
                res.status(403).json("You allready follow this user !")
            }
        }
        catch(err){
            res.status(500).json("You can't follow yourself :-[");
        }

    }
    else{

    }
})

//unfollowed
router.put("/:id/unfollow", async(req,res)=>{
    if(req.body.userId !== req.params.id ){
        try{
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body.userId);

            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull: {followers: req.body.userId}});
                await currentUser.updateOne({$pull: {followings: req.params.id}});
                res.status(200).json({message: "User has been unfollowed :-{ "})
            }
            else{
                res.status(403).json("You allready unfollow this user !")
            }
        }
        catch(err){
            res.status(500).json("You can't unfollow yourself");
        }

    }
    else{

    }
})



module.exports = router;