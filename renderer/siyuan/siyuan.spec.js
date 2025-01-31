import { describe, test, expect } from "vitest";
const { SiyuanContext, Block } = require("./siyuan");

describe("CRUD", () => {
  const context = new SiyuanContext(
    // "http://127.0.0.1:6806",
    // "qmtxfk8u2jzzc1pl"
    "http://127.0.0.1:6807",
    "ixrtz2ca8c8qlqh5"
  );
  // const testBlockAnchorId = "20241226151106-w11layg"; // [test](siyuan://blocks/20240418143356-0a40kr5)
  const testBlockAnchorId = "20241217180606-w05b09k"; // [test](siyuan://blocks/20240418143356-0a40kr5)
  const testDoc = "20230424133737-72h3a87"; // [siyuan](siyuan://blocks/20230424133737-72h3a87)
  test("api lsNotebooks", async () => {
    let res = await context.axios.post("/api/notebook/lsNotebooks");
    expect(res.status).toBe(200);
    let notebookNames = res.data.data.notebooks.map((i) => i.name);
    expect(notebookNames).in;
    let notebook_guides = res.data.data.notebooks.filter(
      // (i) => i.name === "思源笔记用户指南"
      (i) => i.name === "Daily Journals"
    )[0];
    expect(notebook_guides.id).toBe("20211207162118-04bqar3");
  });
  test("api querySql", async () => {
    const blocks = await context.querySql(
      "SELECT * FROM blocks WHERE id=20201224120447-bx9fwlf"
    );
    // console.log(blocks);
  });
  test.only("api apiBlockInsertBlock", async () => {
    // const block = await context.getLatestCreatedBlock();
    // console.log(block.id);
    const block = {
      id: testBlockAnchorId,
    };
    // let blockKramdown = await context.apiGetBlockKramdown({ id: block.id });
    // console.log(blockKramdown);

    const params = {
      dataType: "markdown",
      // data: 'foo**bar**{: style="color: var(--b3-font-color8);"}baz',
      data: "world",
      // nextID: "",
      previousID: block.id,
      // parentID: "",
    };
    // expect(params.previousID).toBe(block.id);
    let data = await context.apiBlockInsertBlock(params);
    // console.log(data);
  });
  test("api apiGetBlockKramdown", async () => {
    const block = await context.getLatestCreatedBlock();
    let data = await context.apiGetBlockKramdown({ id: block.id });
    // console.log("[debug api apiGetBlockKramdown]", data);
  });
  test("api apiBlockGetChildBlocks", async () => {
    const block = await context.getTodayDairyBlock();
    // console.log(block.id);
    // console.log(block);
    // let data = await context.apiBlockGetChildBlocks({ id: block.id });
    // let data = await context.apiBlockGetChildBlocks({
    //   id: "20240418095723-iqztyyn",
    // });
    // console.log("[debug api apiBlockGetChildBlocks]", data);
  });
  test("api 块crud", async () => {
    // const block = await context.getLatestCreatedBlock();
  });
  test("最近新增", async () => {
    const block = await context.getLatestCreatedBlock();
    // console.log(block);
    // expect(blocks[0]).
  });
  test("当天页面block", async () => {
    const block = await context.getTodayDairyBlock();
    // console.log(block);
    // expect(blocks[0]).
  });

  test("追加一条", () => {});
});

describe.todo("网页记录");
describe.todo("时间戳");
