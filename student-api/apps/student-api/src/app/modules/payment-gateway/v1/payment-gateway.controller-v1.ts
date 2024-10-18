import { TransactionsDateInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  UserTransactions,
  PaymentGatewayServiceV1,
  CreateOrder,
} from '@application/shared-api';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import * as Razorpay from 'razorpay';
import { environment } from 'apps/student-api/src/environments/environment';

@Controller('paymentgateway/v1')
export class PaymentGatewayControllerV1 {
  constructor(private paymentGatewayService: PaymentGatewayServiceV1) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrderForPayment(
    @Request() request,
    @Body() createOrder: CreateOrder
  ) {
    var data = await this.paymentGatewayService.generateReferenceId(
      request,
      // instance,
      createOrder
    );

    return {
      status: data.status,
      code: data.code,
      message: data.message,
      data: data.data,
    };
  }

  @Post('update-payment-status/:tans')
  async updateRazorpayPaymentStatus(@Request() request, @Body() body) {
    let instance = null;
    const response = JSON.parse(
      Buffer.from(body.response, 'base64').toString('utf-8')
    );

    const resData = await this.paymentGatewayService.updatePhonepePaymentStatus(
      request,
      response,
      body
    );

    return {
      status: resData.status,
      code: resData.code,
      message: resData.message,
      data: resData.data,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('get-payment-status/:tans')
  async getPhonepayPaymentStatus(
    @Request() request,
    @Param('tans') transactionId
  ) {
    const resData = await this.paymentGatewayService.getPhonepayPaymentStatus(
      request,
      transactionId
    );
    return {
      status: resData.status,
      code: resData.code,
      message: resData.message,
      data: resData.data,
    };
  }

  @Post('check-and-update-payment-status')
  async checkUpdateRazorpayPaymentStatus(@Request() request, @Body() body) {
    var data = await this.paymentGatewayService.getPhonepayPaymentStatus(
      request,
      body.phonepeTransactionId
    );

    return {
      status: data.status,
      code: data.code,
      message: data.message,
      data: data.data,
    };
  }


  @UseGuards(JwtAuthGuard)
  @Post('sent-payment-link')
  async generatePaymentLink(@Request() request, @Body() createOrder) {
    const user = request.user;

    var data = await this.paymentGatewayService.generatePaymentLink(
      request,
      createOrder
    );

    return {
      status: data.status,
      code: data.code,
      message: data.message,
      data: data.data,
    };

    // const payload = {
    //   merchantId: 'M222FRSZ155WA',
    //   transactionId: 'TX' + new Date().getTime(),
    //   merchantOrderId: 'M' + new Date().getTime(),
    //   amount: 10000,
    //   instrumentType: 'MOBILE',
    //   instrumentReference: '9533402327',
    //   message: 'collect for XXX order',
    //   email: 'amitxxx75@gmail.com',
    //   expiresIn: 180,
    //   shortName: 'DemoCustomer',
    //   storeId: 'store1',
    //   terminalId: 'terminal1',
    // };

    // const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
    //   'base64'
    // );

    // // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const crypto = require('crypto');

    // const base64Hash =
    //   base64Payload + '/v3/charge' + '27163efb-8175-4397-ba0c-1b080053b9af';
    // const hash = crypto.createHash('sha256').update(base64Hash).digest('hex');

    // const checksum = hash + '###1';

    // const instance = await axios
    //   .post(
    //     'https://mercury-t2.phonepe.com/v3/charge',
    //     {
    //       request: base64Payload,
    //     },
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'X-VERIFY': checksum,
    //         accept: 'application/json',
    //         'X-CALLBACK-URL': 'http://localhost:8081/api/',
    //         // 'X-PROVIDER-ID': 'UATPROVIDER',
    //       },
    //     }
    //   )
    //   .then(function (response) {
    //     console.log(response);
    //     return response.data;
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
    // console.log(instance);


    // return {
    //   status: true,
    //   code: 2001,
    //   message: 'mess',
    //   data: instance,
    // };
  }


  @UseGuards(JwtAuthGuard)
  @Post('check-payment-link-status/:trns')
  async checkPaymentLinkStatus(@Request() request, @Body() body, @Param('trns') transactionId) {
    // const user = request.user;


    // // eslint-disable-next-line @typescript-eslint/no-var-requires
    // const crypto = require('crypto');

    // const base64Hash = '/v3/transaction/M222FRSZ155WA/'+transactionId+'/status' + '27163efb-8175-4397-ba0c-1b080053b9af';
    // const hash = crypto.createHash('sha256').update(base64Hash).digest('hex');

    // const checksum = hash + '###1';

    // const instance = await axios
    //   .get(
    //     ' https://mercury-t2.phonepe.com/v3/transaction/M222FRSZ155WA/TX1710345385122/status',
    //     {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'X-VERIFY': checksum,
    //         accept: 'application/json',
    //       },
    //     }
    //   )
    //   .then(function (response) {
    //     console.log(response);
    //     return response.data;
    //   })
    //   .catch(function (error) {
    //     console.error(error);
    //   });
    // console.log(instance);


    // return {
    //   status: true,
    //   code: 2001,
    //   message: 'mess',
    //   data: instance,
    // };
  }
}
