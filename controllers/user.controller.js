import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import {Tweet} from '../models/twite.model.js'


export const userRegister = async (req, res) => {
    try {
        const { name, username, email, password } = req.body
        if (!name || !username || !email || !password) {
            return res.status(401).json({
                message: "Something is Missing!",
                success: false
            })
        }
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User already exist!",
                success: false
            })
        }
        const hasePass = await bcrypt.hash(password, 10)
        user = await User.create({ name, username, email, password: hasePass })
        return res.status(201).json({
            message: "Account created successfully!",
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required!",
        success: false,
      });
    }

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User does not exist!",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        message: "Wrong email or password!",
        success: false,
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.secret, {
      expiresIn: "1d",
    });

    return res.status(200).cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
      secure:true // 1 day
    }).json({
      message: `Welcome back ${user.name}`,
      success: true,
      user
    });

  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};


export const userLogOut = (req, res) => {
    try {
        return res
            .cookie("token", "", {
                httpOnly: true,
                expires: new Date(0),
            })
            .status(200)
            .json({
                message: "User logged out!",
                success: true,
            });
    } catch (error) {
        console.log(error);
    }
};

export const bookMark = async (req, res) => {
    try {
        const loggedInUser = req.user
        const tweetId = req.params.id
        const user = await User.findById(loggedInUser)
        if (user.bookmark.includes(tweetId)) {
            await User.findByIdAndUpdate(loggedInUser, { $pull: { bookmark: tweetId } })
            return res.status(200).json({
                message: "Tweet removed from Bookmark!",
                success: true
            });
        } else {
            await User.findByIdAndUpdate(loggedInUser, { $push: { bookmark: tweetId } })
            return res.status(200).json({
                message: "Tweet Bookmarked!",
                success: true,
            });
        }

    } catch (error) {
        console.log(error);
    }
}

export const getMyProfile = async (req, res) => {
    try {
        const { userId } = req.body

        if (!userId) {
            return res.status(400).json({
                message: "UserId is missing in body",
                success: false
            })
        }

        const user = await User.findById(userId).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Profile fetched",
            user,
            success: true
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}

export const getOtherProfile = async (req, res) => {
    try {
        const {id} = req.body

        if (!id) {
            return res.status(400).json({
                message: "UserId is missing in body",
                success: false
            })
        }

        const user = await User.findById(id).select("-password")
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false
            })
        }

        return res.status(200).json({
            message: "Profile fetched",
            user,
            success: true
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Internal server error",
            success: false
        })
    }
}



export const getotherUser = async (req, res) => {
    try {
        const loggedUserId = req.user
        const otheruser = await User.find({ _id: { $ne: loggedUserId } }).select("-password")
        return res.status(200).json({
            message: "Other user",
            otheruser,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const Follow = async (req, res) => {
    try {
        const loggedInUserId = req.user
        const followingId = req.params.id
        const loggedInUser = await User.findById(loggedInUserId)
        const followingUser = await User.findById(followingId)
        if (!loggedInUser || !followingUser) {
            return res.status(404).json({
                message: "User Not Found!",
                success: false
            })
        }
        if (!followingUser.followers.includes(loggedInUserId)) {
            await followingUser.updateOne({ $push: { followers: loggedInUserId } })
            await loggedInUser.updateOne({ $push: { following: followingId } })
        } else {
            return res.status(400).json({
                message: `You already followed ${followingUser.name}`,
                success: false
            })
        }
        return res.status(200).json({
            message: `You just follow ${followingUser.name}`,
            success: true
        })

    } catch (error) {
        console.log(error);
    }
}

export const unFollow = async (req, res) => {
    try {
        const loggedInUserId = req.user
        const followingId = req.params.id
        const loggedInUser = await User.findById(loggedInUserId)
        const followingUser = await User.findById(followingId)
        if (!loggedInUser || !followingUser) {
            return res.status(404).json({
                message: "User Not Found!",
                success: false
            })
        }
        if (loggedInUser.following.includes(followingId)) {
            await followingUser.updateOne({ $pull: { followers: loggedInUserId } })
            await loggedInUser.updateOne({ $pull: { following: followingId } })
        } else {
            return res.status(400).json({
                message: `You Not followed ${followingUser.name}`,
                success: false
            })
        }
        return res.status(200).json({
            message: `You just Unfollow ${followingUser.name}`,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}



export const getBookmarkedTweets = async (req, res) => {
    try {
        const loggedInUserId = req.user;

        const user = await User.findById(loggedInUserId);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                success: false,
            });
        }


        
        const bookmarkedTweets = await Tweet.find({
            _id: { $in: user.bookmark },
        }).populate("userId", "name username"); 
        return res.status(200).json({
            message: "Bookmarked tweets fetched successfully",
            success: true,
            tweets: bookmarkedTweets,
        });
    } catch (error) {
        console.error("Error fetching bookmarks:", error);
        return res.status(500).json({
            message: "Internal server error",
            success: false,
        });
    }
};
