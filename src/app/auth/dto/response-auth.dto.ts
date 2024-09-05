
export class ResponseAuthDto {
    token: string;
    expiresIn: number;
}

export interface RequestWithUserId extends Request {

    user: {

        sub: string;

        username: string;
    }
}