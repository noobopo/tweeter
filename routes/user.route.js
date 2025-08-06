import express from 'express'
import { bookMark, Follow, getBookmarkedTweets, getMyProfile, getOtherProfile, getotherUser, unFollow, userLogin, userLogOut, userRegister } from '../controllers/user.controller.js'
import { isAuthonticated } from '../middleware/auth.js'

const router = express.Router()

router.post('/register', userRegister)
router.post('/login', userLogin)
router.get('/logout', userLogOut)
router.put('/bookmark/:id',isAuthonticated, bookMark)
router.get('/bookmark/',isAuthonticated, getBookmarkedTweets)
router.post('/myprofile',isAuthonticated, getMyProfile)
router.post('/otherprofile',isAuthonticated, getOtherProfile)
router.get('/others',isAuthonticated, getotherUser)
router.post('/follow/:id',isAuthonticated, Follow)
router.post('/unFollow/:id',isAuthonticated, unFollow)



export default router