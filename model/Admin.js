module.exports = {
  get: function(con, callback) {
    con.query("SELECT trans.trans_id,user.nama ,user.alamat,user.no_hp,gal.brand,trans.jmlh_galon,trans.harga_total,trans.date,trans.status,trans.failed_msg FROM transaksi_order trans,mst_galon gal,mst_pelanggan user where trans.id_pelanggan = user.id_pelanggan and trans.id_galon = gal.id_galon  ORDER BY trans.trans_id DESC", callback)
  },

  login_post: function(con, data,hash,callback) {
    con.query(`SELECT count(id_admin) as admin FROM mst_admin WHERE email ="`+data.email+`" and pass="`+hash+`"`, callback)
  },

  register_post: function(con, data,hash,callback) {
    con.query(
      `INSERT INTO mst_admin SET 
       nama = '${data.name}', 
       pass = '`+hash+`',
       no_hp = '${data.no_hp}',
       alamat = '${data.alamat}',
       email = '${data.email}'`,
      callback
    )
  },

  getGalon: function(con, callback) {
    con.query("SELECT * FROM mst_galon", callback)
  },

  getGraphData: function(con, data,callback) {
    con.query("SELECT  MONTHNAME(trans.date) AS Month,gal.brand, SUM(trans.jmlh_galon) AS quantity FROM transaksi_order trans,mst_galon gal WHERE YEAR(trans.date) = "+data+" and trans.id_galon = gal.id_galon and status=1 GROUP BY MONTH(trans.date), trans.id_galon", callback)
  },

  getTotalOrderToday: function(con,callback) {
    con.query("select COUNT(*) AS total from transaksi_order WHERE DATE(date) = CURDATE() and status=1", callback)
  },

  getTotalProfitToday: function(con,callback) {
    con.query("select sum(harga_total) AS total from transaksi_order WHERE DATE(date) = CURDATE() and status=1", callback)
  },

  getTotalGallonToday: function(con,callback) {
    con.query("select sum(jmlh_galon) AS total from transaksi_order WHERE DATE(date) = CURDATE() and status=1", callback)
  },

  setFinish: function(con,id,callback) {
    con.query(
      `UPDATE transaksi_order SET 
      status = 1 
      WHERE trans_id = `+id+` AND status <> -1`,
      callback
    )
  },

  setCancel: function(con,id,callback) {
    con.query(
      `UPDATE transaksi_order SET 
      status = -1,
      failed_msg = 'Admin canceled this order' 
      WHERE trans_id = `+id+` AND status <> 1`,
      callback
    )
  },
  
  addGalon: function(con, data,img_path, callback) {
    con.query(
      `INSERT INTO mst_galon SET 
       brand = '${data.brand}', 
       stock = '${data.stock}',
       harga = '${data.harga}',
       img_url = '`+img_path+`'`,
      callback
    )
  },

  editGalon: function(con, data,img_url, callback) {
    if (img_url!=""){
      con.query(
        `UPDATE mst_galon SET 
        brand = '${data.brand_edt}', 
        stock = '${data.stock_edt}',
        img_url = '`+img_url+`',
        harga = '${data.harga_edt}' 
        WHERE id_galon = ${data.id_brand_edt}`,
        callback
      )
    } else {
      con.query(
        `UPDATE mst_galon SET 
        brand = '${data.brand_edt}', 
        stock = '${data.stock_edt}',
        harga = '${data.harga_edt}' 
        WHERE id_galon = ${data.id_brand_edt}`,
        callback
      )
    }
  },

  removeGalon: function(con, id, callback) {
    con.query(`DELETE FROM mst_galon WHERE id_galon = ${id}`, callback)
  }
}
