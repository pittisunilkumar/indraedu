import { IsOptional } from 'class-validator';
// import { credential, initializeApp, messaging, app } from 'firebase-admin';
// import { ApiModelPropertyOptional } from '@nestjs/swagger';

export class NotificationDto {
    @IsOptional() readonly data?: { [key: string]: string };
    // @IsOptional() readonly notification?: messaging.Notification;
    // @IsOptional() readonly android?: messaging.AndroidConfig;
    // @IsOptional() readonly webpush?: messaging.WebpushConfig;
    // @IsOptional() readonly apns?: messaging.ApnsConfig;
}
