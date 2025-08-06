import express from 'express'
import { createTweet, deleteTweet, getAllTweet, getOthersTweet, getUserTweet, like } from '../controllers/Tweet.controller.js'
import { isAuthonticated } from '../middleware/auth.js'


const router = express.Router()

router.post('/create',isAuthonticated,createTweet)
router.delete('/delete/:tweetId',isAuthonticated,deleteTweet)
router.put('/update/:id',isAuthonticated,like)
router.get('/alltweet',isAuthonticated,getAllTweet)
router.get('/othertweet',isAuthonticated,getOthersTweet)
router.post('/mytweet',isAuthonticated,getUserTweet)
// router.post('/tweet',isAuthonticated,getTweetById)

export default router