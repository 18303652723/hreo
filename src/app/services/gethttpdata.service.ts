import { Injectable, Inject } from '@angular/core';
import { ServicesModule, API_CONFIG, Company_Config, BASE_URI } from './services.module';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/internal/operators';
import { GetCurrentUser } from './getCurrentUser.service';

@Injectable({
  providedIn: ServicesModule
})
export class GethttpdataService {

  constructor(private http: HttpClient, @Inject(API_CONFIG) private uri: string, @Inject(Company_Config) private Company_Config: object, private currentUser: GetCurrentUser, @Inject(BASE_URI) private base_uri: string) { }

  /**
   * 获取请求数据接口
   * @param  uri  请求链接前缀
   * @param  Company_Config  公司ID,用户ID 配置
   * @param  MethodName  后台方法名
   * @param params 请求参数
   * @param login_id 登录者ID
   */
  getParams(params) {
    params = params ? { ...params, ...this.Company_Config, ...{ login_id: this.currentUser.getCurrentUserId() } } : { ...this.Company_Config, ...{ login_id: this.currentUser.getCurrentUserId() } };

    return params;
  }

  getHttp(data, method) {
    const params = new HttpParams({
      fromObject: this.getParams(data)
    });
    return this.http.get(this.uri + method, { params })
      .pipe(map((res: { data: any }) => res.data));
  }

  getHttpBase(data, method) {
    const params = new HttpParams({
      fromObject: this.getParams(data)
    });
    return this.http.get(this.base_uri + method, { params })
      .pipe(map((res: { data: any }) => res.data));
  }

  postHttp(data, method) {
    const params = new HttpParams({
      fromObject: this.getParams(data)
    });
    return this.http.post(this.uri + method, params)
      .pipe(map((res: { data: any }) => res.data));
  }

  /**
	 * 首页 -- 轮播图
	 */
  loginLatest(data?) {
    return this.getHttp(data, 'GameLogin/login')
  }

  /**
	 * 首页 -- 轮播图
	 */
  banner(data?) {
    return this.getHttp(data, 'GameMobile/banner')
  }

  /**
	 * 首页 -- 推荐商品
	 */
  recommend(data?) {
    return this.getHttp(data, 'GameMobile/recommend')
  }

  /**
   * 首页分类
   */
  intention_category(data?) {
    return this.getHttp(data, 'Webgameuser/intention_category')
  }

  /**
   * 我要买 区服列表
   */
  area_list(data?) {
    return this.getHttp(data, `Webgameuser/area_list`);
  }

  /**
   * 我要卖 用户信息
   */
  user_info(data?) {
    return this.getHttp(data, 'Webgameuser/user_info')
  }

  /**
   * 我要卖 分类列表
   */
  goods_model_category(data?) {
    return this.getHttp(data, 'Webgameuser/goods_model_category')
  }

  /**
   * 我要卖 字段列表
   */
  goods_model_field(data?) {
    return this.getHttp(data, 'Webgameuser/goods_model_field')
  }

  /**
   * 我要卖 协议
   */
  agreement_list(data?) {
    return this.getHttp(data, 'Webgameuser/agreement_list')
  }

  /**
   * 我要卖 用户提交审核数据
   */
  user_sell_opt(data?) {
    return this.postHttp(data, 'Webgameuser/user_sell_opt')
  }

  /**
   * 我要买 商品列表
   */
  unsold_goods_list(data?) {
    return this.getHttp(data, 'Webgameuser/unsold_goods_list')
  }

  /**
   * 我要买 商品详情
   */
  unsold_goods_detail(data?) {
    return this.getHttp(data, 'Webgameuser/unsold_goods_detail')
  }

  /**
   * 我要买 商品详情(相关)
   */
  unsold_goods_related(data?) {
    return this.getHttp(data, 'Webgameuser/unsold_goods_related')
  }

  /**
   * 我要买 商品购买信息
   */
  unsold_goods_buy_info(data?) {
    return this.getHttp(data, 'Webgameuser/unsold_goods_buy_info')
  }

  /**
   * 我要买 商品购买操作
   */
  unsold_goods_buy_opt(data?) {
    return this.getHttp(data, 'Webgameuser/unsold_goods_buy_opt')
  }

  /**
   * 我要买 商品类型筛选
   */
  goods_type_list(data?) {
    return this.getHttp(data, 'Webgameuser/goods_type_list')
  }

  /**
   * 我要买 服务器筛选列表
   */
  server_list(data?) {
    return this.getHttp(data, 'Webgameuser/server_list')
  }

  /**
   * 我要买 游戏类型筛选
   */
  game_list(data?) {
    return this.getHttp(data, 'Webgameuser/game_list')
  }

  /**
   * 我要买 商品发布者店铺
   */
  sell_store(data?) {
    return this.getHttp(data, 'Webgameuser/sell_store')
  }

  /**
   * 我的店铺
   */
  goods_store(data?) {
    return this.getHttp(data, 'Webgameuser/goods_store')
  }

  /**
   * 论坛列表
   */
  forum_list(data?) {
    return this.getHttp(data, 'Webgameforum/forum_list')
  }

  /**
   * 论坛详情
   */
  forum_detail(data?) {
    return this.getHttp(data, 'Webgameforum/forum_detail')
  }

  /**
   * 发布论坛
   */
  forum_submit(data?) {
    return this.getHttp(data, 'Webgameforum/forum_submit')
  }

  /**
   * 论坛评论
   */
  forum_comment_submit(data?) {
    return this.getHttp(data, 'Webgameforum/forum_comment_submit')
  }

  /**
   * 论坛评论列表
   */
  forum_comment_list(data?) {
    return this.getHttp(data, 'Webgameforum/forum_comment_list')
  }

  /**
   * 论坛点赞
   */
  forum_thumb_up(data?) {
    return this.getHttp(data, 'Webgameforum/forum_thumb_up')
  }

  /**
   * 评论信息列表
   */
  new_msg_list(data?) {
    return this.getHttp(data, 'Webgameforum/new_msg_list')
  }

  /**
   * 评论信息回复
   */
  msg_list_reply(data?) {
    return this.getHttp(data, 'Webgameforum/msg_list_reply')
  }

  /**
   * 评论已被阅读
   */
  msg_isread(data?) {
    return this.getHttp(data, 'Webgameforum/msg_isread')
  }

  /**
   * 论坛分类列表
   */
  forum_share_classify(data?) {
    return this.getHttp(data, 'Webgameforum/forum_share_classify')
  }

  /**
	 * 个人中心 -- 我是买家 -- 订单列表
	 */
  toBePaidOrder(data) {
    return this.getHttp(data, 'Game/toBePaidOrder')
  }

	/**
	 * 个人中心 -- 我是买家 -- 订单数量
	 */
  orderListNum(data?) {
    return this.getHttp(data, 'Game/toBePaidOrderNum')
  }

	/**
	 * 个人中心 -- 我是买家 -- 订单删除
	 */
  delOrder(data?) {
    return this.getHttp(data, 'Game/delOrder')
  }

	/**
	 * 个人中心 -- 我是买家 -- 退款/确认收货
	 */
  orderHandle(data) {
    return this.getHttp(data, 'Game/orderHandle')
  }

	/**
	 * 个人中心 -- 我是买家 -- 购买确认
	 */
  confirmBuy(data?) {
    return this.getHttp(data, 'Game/confirmBuy')
  }

	/**
	 * 个人中心 -- 我是买家 -- 确认购买按钮
	 */
  continuePay(data) {
    return this.getHttp(data, 'Game/continuePay')
  }

	/**
	 * 个人中心 -- 我是卖家 -- 修改价格
	 */
  modifyPrice(data) {
    return this.getHttp(data, 'Game/modifyPrice')
  }

	/**
	 * 个人中心 -- 我是买家 -- 确认购买按钮
	 */
  submitOrder(data) {
    return this.getHttp(data, 'Game/submitOrder')
  }

	/**
	 * 个人中心 -- 我是卖家 -- 商品列表
	 */
  sellerGoods(data) {
    return this.getHttp(data, 'Game/sellerGoods')
  }

	/**
	 * 个人中心 -- 我是卖家 -- 商品状态切换
	 */
  submitGoods(data?) {
    return this.getHttp(data, 'Game/submitGoods')
  }

	/**
	 * 个人中心 -- 我是卖家 -- 删除商品
	 */
  delGoods(data?) {
    return this.getHttp(data, 'Game/delGoods')
  }

	/**
	 * 个人中心 -- 我是卖家 -- 商品数量
	 */
  sellerGoodsNum(data?) {
    return this.getHttp(data, 'Game/sellerGoodsNum')
  }

	/**
	 * 个人中心 -- 我是卖家 -- 订单列表
	 */
  sellerOrders(data) {
    return this.getHttp(data, 'Game/sellerOrders')
  }

	/**
	 * 个人中心 -- 我是买家 -- 订单数量
	 */
  sellerOrdersNum(data?) {
    return this.getHttp(data, 'Game/sellerOrdersNum')
  }

	/**
	 * 我要买 -- 商品详情
	 */
  goodsDetail(data?) {
    return this.getHttp(data, 'GameMobile/goodsDetail')
  }

	/**
	 * 登录&注册
	 */
  login(data) {
    return this.getHttp(data, 'GameLogin/login')
  }

  /**
	 * 退出
	 */
  logout(data?) {
    return this.getHttp(data, 'Game/logout')
  }

	/**
	 * 获取图形验证码
	 */
  getCaptcha(data?) {
    return this.getHttp(data, 'GameLogin/getCaptcha')
  }

  /**
	 * 获取图形验证码
	 */
  generateSmsCode(data?) {
    return this.getHttpBase(data, 'DealerWechat/Show/send_sms_code')
  }

	/**
	 * 生成订单
	 */
  addOrder(data) {
    return this.getHttp(data, 'Game/addOrder')
  }

	/**
	 * 聊一聊列表
	 */
  feedBackList(data?) {
    return this.getHttp(data, 'Game/feedBackList')
  }

	/**
	 * 客户反馈 聊天页面
	 */
  feedbackChat(data) {
    return this.getHttp(data, 'Game/feedBackDetail')
  }

	/**
	 * 回复消息
	 */
  inputChat(data) {
    return this.getHttp(data, 'Game/inputChat')
  }

	/**
	 * 交易动态 -- 站内信
	 */
  message(data?) {
    return this.getHttp(data, 'Game/message')
  }

	/**
	 * 交易动态 -- 站内信详情
	 */
  messageDetail(data?) {
    return this.getHttp(data, 'Game/messageDetail')
  }

  /**
	 * 修改
	 */
  updatePersonalInfo(data) {
    return this.getHttp(data, 'GameMobile/updatePersonalInfo')
  }

	/**
	 * 个人信息
	 */
  personalInfo(data) {
    return this.getHttp(data, 'GameMobile/personalInfo')
  }

  /**
   * 个人中心 -- 店铺收藏
   */
  getStoreInfo(data) {
    return this.getHttp(data, 'GameMobile/storeInfo')
  }

  /**
   * 个人中心 -- 商品收藏
   */
  getGoodsInfo(data) {
    return this.getHttp(data, 'GameMobile/goodsInfo')
  }

  /**
   * 聊天回复 是否为新消息
   */
  viewedNewMsg(data) {
    return this.getHttp(data, 'Game/viewedNewMsg')
  }


  uoloadFile(file) {
    const formData = new FormData();
    formData.set('file', file);
    return this.http.post(this.base_uri + 'DealerWechat/File/uploadPicture', formData);
  }

  // 获取可提现金额
  getCashWithdrawPrice() {
    return this.http.get(this.uri + `GameMobile/applyWithdrawInit`);
  }

  // 申请提现微信接口
  applyCashWithdrawWechat(wxNickNameMember, withdrawMoney, collectionQrcode) {
    const params = new HttpParams({
      fromObject: {
        withdrawMoney,  // 提现金额
        wxNickNameMember,  // 微信账号
        collectionQrcode,  // 收款二维码url
        withdraw_type: '1'
      }
    });
    return this.http.get(this.uri + `GameMobile/applyWithdraw`, { params });
  }

  // 申请提现微信接口
  applyCashWithdrawBank(bank, account, name) {
    const params = new HttpParams({
      fromObject: {
        bank,  // 提现金额
        account,  // 微信账号
        name,  // 收款二维码url
        withdraw_type: '2'
      }
    });
    return this.http.get(this.uri + `GameMobile/applyWithdraw`, { params });
  }

  getCashWithdrawRecord() {
    return this.http.get(this.uri + `GameMobile/withdrawRecord`);
  }

  // 是否申请过代练
  getIsWhereas() {
    return this.http.get(this.uri + `GameMobile/IsWhereas`);
  }
   
  // 通过申请代练
  applyOpen() {
    return this.http.get(this.uri + `GameMobile/applyOpen`);
  }

  // 申请回退代练押金
  applyReturn() {
    return this.http.get(this.uri + `GameMobile/applyReturn`);
  }

  /**
   * 我要卖 是否有代练订单未完成
   */
  uncompleted_list(data?) {
    return this.getHttp(data, 'webgameuser/uncompleted_list')
  }

  loginAgreementList(data?) {
    return this.getHttp(data,'GameLogin/agreement_list')
  }
}
