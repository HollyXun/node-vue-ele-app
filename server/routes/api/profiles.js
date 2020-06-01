// @login & register
const express = require("express")
const router = express.Router();
const passport = require("passport");

const Profile = require('../../models/Profile')

// $route GET api/profiles/test
// @desc 返回请求的json数据
// @access public
router.get("/test", (req, res) => {
    res.json({msg: "Profile is Running"})
})

// $route POST api/profiles/add
// @desc 创建信息接口
// @access Private
router.post("/add", passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields = {}
    if (req.body.type) {
        profileFields.type = req.body.type
    }
    if (req.body.describe) {
        profileFields.describe = req.body.describe
    }
    if (req.body.income) {
        profileFields.income = req.body.income
    }
    if (req.body.expend) {
        profileFields.expend = req.body.expend
    }
    if (req.body.cash) {
        profileFields.cash = req.body.cash
    }
    if (req.body.remark) {
        profileFields.remark = req.body.remark
    }

    new Profile(profileFields).save().then(profile => {
        res.json(profile)
    })
})


// $route GET api/profiles
// @desc 获取所有信息
// @access Private
router.get("/", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.find()
        .then(profile => {
            if (!profile) {
                return res.status(404).json("没有任何内容")
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json(err)
        })
})


// $route GET api/profiles/:id
// @desc 获取单个id
// @access Private
router.get("/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
    Profile.findOne({_id: req.params.id})
        .then(profile => {
            if (!profile) {
                return res.status(404).json("没有任何内容")
            }
            res.json(profile)
        })
        .catch(err => {
            res.status(404).json(err)
        })
})


// $route POST api/profiles/edit/:id
// @desc 编辑信息接口
// @access Private
router.post("/edit/:id", passport.authenticate('jwt', {session: false}), (req, res) => {
    const profileFields = {}
    if (req.body.type) {
        profileFields.type = req.body.type
    }
    if (req.body.describe) {
        profileFields.describe = req.body.describe
    }
    if (req.body.income) {
        profileFields.income = req.body.income
    }
    if (req.body.expend) {
        profileFields.expend = req.body.expend
    }
    if (req.body.cash) {
        profileFields.cash = req.body.cash
    }
    if (req.body.remark) {
        profileFields.remark = req.body.remark
    }

    Profile.findOneAndUpdate(
        //对应ID
        {_id: req.params.id},
        //配置更新的内容
        {$set: profileFields},
        {new: true}
    ).then(profile => {
        res.json(profile)
    })
})

// $route delete api/profiles/delete/:id    :id | delete 删除
// @desc 删除信息接口
// @access  private
router.delete("/delete/:id", passport.authenticate('jwt', { session: false }), (req, res) => {

    Profile.findOneAndRemove(
        { _id: req.params.id },
    ).then(profile => {
        // profile.save().then(profile => res.json(profile)); // 没什么用, 如果save空对象，直接报下面的错误
        if (profile) {
            res.status(200).json({
                code: 0,
                msg: '信息删除成功',
                data: profile
            })
        }
        res.status(200).json({
            code: 1,
            msg: '删除的对象不存在',
        })

    }).catch(err => {
        res.status(400).json({
            code: 1,
            msg: '删除失败!, 请具体查看 errMsg',
            errMsg: err.message
        })
    })
});


module.exports = router;