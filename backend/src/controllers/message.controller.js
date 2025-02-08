import User from "../models/user.model.js";
import Message from "../models/message.model.js";

export const getUsersForSidebar = async(req, res)=>{
    try {
        const loggedInUser = req.user._id;
        // all the user except the logged in user, and $ne = not equal to and select except password
        const fileredUsers = await User.find({_id :{$ne:loggedInUser}}).select("-password");

        res.status(200).json(fileredUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar controller:", error.message);
        res.status(500).json({message:"Internal Server Error"});
    }
};

export const getMessages = async(req, res)=>{
    try {
        // renamed id to userToChatId
        const {id:userToChatId} = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            // fetch all the chats where either i am the sender or the other user is the sender
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId},
            ]
        })
        
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller:", error.message);
        res.status(500).json({message:"Internal Server Error"});    
    }
};

export const sendMessage = async(req, res)=>{    
    try {
        const {text, image} = req.body;
        // renamed id to userToChatId
        const {id:receiverId} = req.params;
        const senderId = req.user._id;
        
        let imageUrl;
        if(image){
            // upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,            
            image:imageUrl,                        
        }); 

        await newMessage.save();


        // todo realtime functionality goes here = > socket.io

        
        res.status(201).json(newMessage);   

    } catch (error) {
        console.log("Error in sendMessage controller:", error.message);
        res.status(500).json({message:"Internal Server Error"});   
    }
};