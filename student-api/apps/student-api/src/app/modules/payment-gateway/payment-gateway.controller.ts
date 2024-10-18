import { TransactionsDateInterface } from '@application/api-interfaces';
import { JwtAuthGuard } from '@application/auth';
import {
  UserTransactions,
  PaymentGatewayService,
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

@Controller('paymentgateway')
export class PaymentGatewayController {
  constructor(private paymentGatewayService: PaymentGatewayService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create-order')
  async createOrderForPayment(
    @Request() request,
    @Body() createOrder: CreateOrder
  ) {
    var getOrganazationDetails = await this.paymentGatewayService.getOrganazationDetailsWithUser(
      request
    );

    if (getOrganazationDetails) {
      var instance = new Razorpay({
        key_id: environment.razorpayKey,
        key_secret: environment.razorpaySecret,
      });

      var data = await this.paymentGatewayService.generateReferenceId(
        request,
        instance,
        createOrder
      );

      return {
        status: data.status,
        code: data.code,
        message: data.message,
        data: data.data,
      };
    } else {
      return {
        status: true,
        code: 2001,
        message: 'Payment Configuration Not Found',
        data: {},
      };
    }
  }

  @UseGuards(JwtAuthGuard)
  @Post('update-payment-status')
  async updateRazorpayPaymentStatus(@Request() request, @Body() body) {
    var getOrganazationDetails = await this.paymentGatewayService.getOrganazationDetailsWithUser(
      request
    );

    if (getOrganazationDetails) {
      var instance = new Razorpay({
        key_id: environment.razorpayKey,
        key_secret: environment.razorpaySecret,
      });

      var data = await this.paymentGatewayService.updateRazorpayPaymentStatus(
        request,
        instance,
        body
      );

      return {
        status: data.status,
        code: data.code,
        message: data.message,
        data: data.data,
      };
    } else {
      return {
        status: true,
        code: 2001,
        message: 'Payment Configuration Not Found',
        data: {},
      };
    }
  }
  @Post('check-and-update-payment-status')
  async checkUpdateRazorpayPaymentStatus(@Request() request, @Body() body) {
    var getOrganazationDetails = await this.paymentGatewayService.getOrganazationDetails(
      body.razorpayOrderId
    );

    if (getOrganazationDetails) {
      var instance = new Razorpay({
        key_id: getOrganazationDetails.razorpayKey,
        key_secret: getOrganazationDetails.razorpaySecret,
      });
      var data = await this.paymentGatewayService.checkUpdateRazorpayPaymentStatus(
        request,
        instance,
        body
      );

      return {
        status: data.status,
        code: data.code,
        message: data.message,
        data: data.data,
      };
    } else {
      return {
        status: true,
        code: 2001,
        message: 'Payment Configuration Not Found',
        data: {},
      };
    }
  }

  @Post('graphy-payment-update')
  async checkUpdateRazorpayPaymentfromGraphy(@Request() request, @Body() body) {
    var instance = new Razorpay({
      key_id: environment.razorpayKey,
      key_secret: environment.razorpaySecret,
    });

    return this.paymentGatewayService.checkUpdateRazorpayPaymentfromGraphy(
      request,
      body
    );
  }
}
