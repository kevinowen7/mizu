const Admin = require("../model/Admin")
const crypto = require('crypto')
var dateFormat = require('dateformat');

module.exports = {
  index: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.user;
    if (cookie === undefined)
    {
      res.render("admin/index", { results: "" })
    } 
    else
    {
      res.redirect("/admin/dashboard")
    } 
  },

  register: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.user;
    if (cookie === undefined)
    {
      res.render("admin/register", { results: "" })
    } else {
      res.redirect("/admin/dashboard")
    } 
    
  },

  login_post: function(req, res) {
    var hash = crypto.createHash('md5').update(req.body.password).digest("hex")
    Admin.login_post(req.con, req.body,hash,function(err ,rows) {
      var hour = 3600000;
      if(rows[0].admin==1){
        res.cookie('user',req.body.email, { maxAge: hour*24});
        res.redirect("/admin/dashboard")
      } else {
        res.redirect("/admin")
      }
    })
  },

  register_post: function(req, res) {
    var hash = crypto.createHash('md5').update(req.body.password).digest("hex")
    var token = req.body.token;
    if (token=="10101010"){
      var hour = 3600000;
      Admin.register_post(req.con,req.body,hash, function(err ,rows) {
        if(rows.affectedRows==1){
          res.cookie('user',req.body.email, { maxAge: hour*24});
          res.redirect("/admin/dashboard")
        }
      })
    } else {
      res.redirect("/admin/register")
    }
  },

  logout: function(req, res) {
    res.cookie('user',"", { maxAge: 0});
    res.redirect("/admin")
  },

  dashboard: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.user;
    if (cookie === undefined)
    {
      res.redirect("/admin")
    } 
    Admin.get(req.con, function(err ,rows) {
      res.render("admin/dashboard", { results: rows })
    })
  },

  getGraphData: function(req, res) {
    Admin.getGraphData(req.con, req.query.year,function(err ,rows) {
      return res.json({ data: rows });
    })
  },

  getTotalOrderToday: function(req, res) {
    Admin.getTotalOrderToday(req.con,function(err ,rows) {
      return res.json({ data: rows });
    })
  },

  getTotalProfitToday: function(req, res) {
    Admin.getTotalProfitToday(req.con,function(err ,rows) {
      return res.json({ data: rows });
    })
  },

  getTotalGallonToday: function(req, res) {
    Admin.getTotalGallonToday(req.con,function(err ,rows) {
      return res.json({ data: rows });
    })
  },

  setCancel: function(req, res) {
    Admin.setCancel(req.con,req.body.id,function(err ,rows) {
      console.log(rows)
      return res.json({ data: rows });
    })
  },

  setFinish: function(req, res) {
    Admin.setFinish(req.con,req.body.id,function(err ,rows) {
      return res.json({ data: rows });
    })
  },

  stock: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.user;
    if (cookie === undefined)
    {
      res.redirect("/admin")
    } 
    Admin.getGalon(req.con, function(err ,rows) {
      res.render("admin/stock", { results: rows })
    })
  },

  add_stock: function(req, res) {
    
    var fileName = req.body.brand;
    var img_url = req.files.img_url;
    var day=dateFormat(new Date(), "yyyymmddhhMMss");
    img_url.mv('public/admin/upload-img/' + day+"_"+fileName + '.jpg' , function(err) {
        if(err){
          console.log(err);
          res.redirect("/admin/stock")
        }else{
          Admin.addGalon(req.con, req.body,'upload-img/' + day+"_"+fileName + '.jpg', function(err ) {
            res.redirect("/admin/stock")
          })
        }
    });
  },

  edit_stock: function(req, res) {
    var fileName = req.body.brand_edt;
    try {
      var img_url = req.files.img_url_up;
      var day=dateFormat(new Date(), "yyyymmddhhMMss");
      img_url.mv('public/admin/upload-img/' + day+"_"+fileName + '.jpg' , function(err) {
          if(err){
            console.log(err);
            res.redirect("/admin/stock")
          }else{
            Admin.editGalon(req.con, req.body,'upload-img/' + day+"_"+fileName + '.jpg', function(err ) {
              res.redirect("/admin/stock")
            })
          }
        });
    } catch(err) {
      Admin.editGalon(req.con, req.body,"", function(err ) {
        res.redirect("/admin/stock")
      })
    }
      
  },

  remove_stock: function(req, res) {
    Admin.removeGalon(req.con, req.body.id_brand_delete, function(err) {
      res.redirect("/admin/stock")
    })
  },

  history: function(req, res) {
    // check if client sent cookie
    var cookie = req.cookies.user;
    if (cookie === undefined)
    {
      res.redirect("/admin")
    } 
    Admin.get(req.con, function(err ,rows) {
      res.render("admin/history", { results: rows })
    })
  }
}
