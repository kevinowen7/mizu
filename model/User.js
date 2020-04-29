module.exports = {
  get: function(con, callback) {
    con.query("SELECT * FROM mst_galon", callback)
  },

  getId: function(con, id,callback) {
    con.query("SELECT * FROM mst_galon WHERE id_galon = "+id, callback)
  },

  getIdUser: function(con, email,callback) {
    con.query("SELECT * FROM mst_pelanggan WHERE email = '"+email+"'", callback)
  },

  getCheckOut: function(con, email,callback) {
    con.query("SELECT gal.*,trans.*,user.* FROM mst_galon gal,transaksi_order trans,mst_pelanggan user WHERE trans.id_galon = gal.id_galon AND trans.id_pelanggan = user.id_pelanggan AND user.email = '"+email+"' ORDER BY trans.trans_id DESC", callback)
  },

  setFinish: function(con,id,callback) {
    con.query(
      `UPDATE transaksi_order SET 
      status = 1 
      WHERE trans_id = `+id+` AND status <> -1`,
      callback
    )
  },

  setCancel: function(con,id,reason,callback) {
    con.query(
      `UPDATE transaksi_order SET 
      status = -1,
      failed_msg = '`+reason+`' 
      WHERE trans_id = `+id+` AND status <> 1`,
      callback
    )
  },

  login: function(con, data,hash,callback) {
    con.query(`SELECT count(id_pelanggan) as user FROM mst_pelanggan WHERE email ="`+data.email+`" and pass="`+hash+`"`, callback)
  },

  register: function(con, data,hash,callback) {
    con.query(
      `INSERT INTO mst_pelanggan SET 
       nama = '${data.name}', 
       pass = '`+hash+`',
       no_hp = '${data.no_hp}',
       alamat = '${data.alamat}',
       email = '${data.email}'`,
      callback
    )
  },

  checkout: function(con, data,callback) {
    var id_pelanggan = data.id_pelanggan
    var call1 = "1"
    var call = ""
    for (var i=0;i<data.id_galonList.length;i++){
      con.query(
        `UPDATE mst_galon SET 
         stock = stock-`+data.jmlh_galonList[i]+`
         WHERE id_galon = '`+data.id_galonList[i]+`' AND stock-`+data.jmlh_galonList[i]+` >= 0`,
         call
      )

      con.query(
        `INSERT INTO transaksi_order SET 
        id_pelanggan = '`+id_pelanggan+`', 
        id_galon = '`+data.id_galonList[i]+`',
        jmlh_galon = '`+data.jmlh_galonList[i]+`',
        harga_total = '`+data.harga_totalList[i]+`',
        status = 0,
        date = CURDATE()`
      )
    }
    callback="1"
  },
}
