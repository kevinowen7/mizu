const User = require("../model/User")
const crypto = require('crypto')

module.exports = {
  index: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.userLogin;
    if (cookie === undefined)
    {
      User.get(req.con, function(err ,rows) {
        res.render("user/index", { results: rows ,user:""})
      })
    } 
    else
    {
      User.get(req.con, function(err ,rows) {
        res.render("user/index", { results: rows,user:cookie })
      })
    } 
  },

  product: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.userLogin;
    if (cookie === undefined)
    {
      User.get(req.con, function(err ,rows) {
        res.render("user/product", { results: rows ,user:""})
      })
    } 
    else
    {
      User.get(req.con, function(err ,rows) {
        res.render("user/product", { results: rows ,user:cookie})
      })
    } 
  },

  product_detail: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.userLogin;
    if (cookie === undefined)
    {
      User.getId(req.con, req.query.id,function(err ,rows) {
        res.render("user/product-detail", { results: rows ,user:""})
      })
    } 
    else
    {
      User.getId(req.con, req.query.id,function(err ,rows) {
        res.render("user/product-detail", { results: rows,user:cookie })
      })
    } 
  },

  login: function(req, res) {
    var hash = crypto.createHash('md5').update(req.body.password).digest("hex")
    User.login(req.con, req.body,hash,function(err ,rows) {
      var hour = 3600000;
      if(rows[0].user==1){
        res.cookie('userLogin',req.body.email, { maxAge: hour*24});
        res.redirect(req.get('referer'));
      } else {
        res.redirect(req.get('referer'));
      }
    })
  },

  register: function(req, res) {
    var hash = crypto.createHash('md5').update(req.body.password).digest("hex")
    User.register(req.con,req.body,hash, function(err ,rows) {
      try{
        if(rows.affectedRows==1){
          var hour = 3600000;
          res.cookie('userLogin',req.body.email, { maxAge: hour*24});
          res.redirect(req.get('referer'));
        }
      } catch (err){
          res.redirect(req.get('referer'));
      }
    })
  },

  logout: function(req, res) {
    res.cookie('userLogin',"", { maxAge: 0});
    res.redirect("/")
  },

  profile: function(req, res) {
    res.render("user/profile")
  },

  edit_profile: function(req, res) {
    res.render("user/edit_profile")
  },

  contact_us: function(req, res) {
    res.render("user/contact_us")
  },

  order: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.userLogin;
    if (cookie === undefined)
    {
      res.render("user/checkout", { results: [] ,user:""})
    } 
    else
    {
      User.getCheckOut(req.con, cookie,function(err ,rows) {
        res.render("user/checkout", { results: rows,user:cookie })
      })
    } 
  },

  setCancel: function(req, res) {
    User.setCancel(req.con,req.body.id,req.body.reason,function(err ,rows) {
      return res.json({ data: rows });
    })
  },

  setFinish: function(req, res) {
    User.setFinish(req.con,req.body.id,function(err ,rows) {
      return res.json({ data: rows });
    })
  },

  cart: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.userLogin;
    if (cookie === undefined)
    {
        res.render("user/cart", { id_pelanggan: "" ,user:""})
    } 
    else
    {
      User.getIdUser(req.con, cookie,function(err ,rows) {
        res.render("user/cart", { id_pelanggan: rows[0].id_pelanggan,user:cookie })
      })
    } 
  },

  checkout: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.userLogin;
    if (cookie === undefined)
    {
      res.redirect(req.get('referer'));
    } 
    else
    {
      User.checkout(req.con, req.body)
      return res.json({ data: "1" });
    } 
  },

}
