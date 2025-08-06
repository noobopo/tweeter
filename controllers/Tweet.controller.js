import { Tweet } from "../models/twite.model.js"
import { User } from "../models/user.model.js"

export const createTweet = async (req, res) => {
    try {
        const { description } = req.body
        const id = req.user
        if (!description || !id) {
            return res.status(401).json({
                message: "Something is Missing!",
                success: false
            })
        }
        await Tweet.create({ description, userId: id })
        return res.status(201).json({
            message: "New Tweet Created!",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteTweet = async (req, res) => {
    try {
        const { tweetId } = req.params
        await Tweet.findByIdAndDelete(tweetId)
        return res.status(200).json({
            message: "Tweet Deleted!",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const like = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const tweetId = req.params.id;

        const tweet = await Tweet.findById(tweetId);
        if (!tweet) {
            return res.status(404).json({
                message: "Tweet not found",
                success: false
            });
        }

        if (tweet.like.includes(loggedInUser)) {
            // Dislike
            await Tweet.findByIdAndUpdate(tweetId, {
                $pull: { like: loggedInUser }
            });
            return res.status(200).json({
                message: "Tweet disliked",
                success: true
            });
        } else {
            // Like
            await Tweet.findByIdAndUpdate(tweetId, {
                $push: { like: loggedInUser }
            });
            return res.status(200).json({
                message: "Tweet liked",
                success: true
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

export const getAllTweet = async (req, res) => {
    try {
        const loggedInUserId = req.user
        const loggedInUser = await User.findById(loggedInUserId)
        const loggedInUserTweet = await Tweet.find({ userId: loggedInUserId }).sort({ createdAt: -1 });
        const loggedInUserFollowingTweet = await Promise.all(loggedInUser.following.map((otherUserId => {
            return Tweet.find({ userId: otherUserId })
        })))
        return res.status(200).json({
            tweets: loggedInUserTweet.concat(...loggedInUserFollowingTweet)
        })
    } catch {
        console.log(error);
    }
}

export const getOthersTweet = async (req, res) => {
    try {
        const loggedInUserId = req.user
        const loggedInUser = await User.findById(loggedInUserId)
        const loggedInUserFollowingTweet = await Promise.all(loggedInUser.following.map((otherUserId => {
            return Tweet.find({ userId: otherUserId })
        })))
        return res.status(200).json({
            tweets: [].concat(...loggedInUserFollowingTweet).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
        })
    } catch {
        console.log(error);
    }
}

export const getUserTweet = async (req, res) => {
    try {
        const {id} = req.body
        const loggedInUserTweet = await Tweet.find({ userId: id })

        return res.status(200).json({
            loggedInUserTweet
        })
    } catch {
        console.log(error);
    }
}