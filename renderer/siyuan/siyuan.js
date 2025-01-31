const axios = require("../lib/axios");

class Block {
  constructor(context, data) {
    this.context = context;
    this.data = data;
    this.id = data.id;
    this.parent_id = data.parent_id;
    this.markdown = data.markdown;
  }
}

class SiyuanContext {
  constructor(url, token) {
    this.url = url;
    this.axios = axios.create({ baseURL: url });
    this.axios.defaults.headers.common["Authorization"] = "Token " + token;
  }

  async apiBlockInsertBlock(params) {
    let res = await this.axios.post("/api/block/insertBlock", params);
    // console.log(res.data);
    return res.data.data;
  }
  async apiGetBlockKramdown(params) {
    let res = await this.axios.post("/api/block/getBlockKramdown", params);
    // console.log(res.data);
    return res.data.data;
  }
  async apiBlockGetChildBlocks(params) {
    let res = await this.axios.post("/api/block/getChildBlocks", params);
    // console.log(res.data);
    return res.data.data;
  }
  async querySql(stmt) {
    let res = await this.axios.post("/api/query/sql", { stmt });
    return res.data.data;
  }
  async getLatestCreatedBlock() {
    const data = await this.querySql(`
      select * from blocks
      ORDER BY created DESC limit 1
    `);
    return new Block(this, data[0]);
  }
  async getTodayDairyBlock() {
    const data = await this.querySql(`
      select * from blocks
      where hpath='/16.4-04-18' and type='d'
    `);
    // console.log(data);
    return new Block(this, data[0]);
  }
}

module.exports = {
  Block,
  SiyuanContext,
};
