import {
    Controller,
    Get,
    Post,
    Body,
    Query,
    Render,
    Res,
    HttpCode,
    HttpStatus,
    UseGuards,
    UseInterceptors,
    Req,
    Param,
} from '@nestjs/common';
import { Response } from 'express';
import { FindAllParameters } from '../investment/dto/findParameters-investment.dto';
import { ListInvestmentsDto } from '../investment/dto/list-investment.dto';
import { InvestmentService } from '../investment/investment.service';
import { AuthService } from '../auth/auth.service';
import { CreateAuthDto } from '../auth/dto/create-auth.dto';
import { AuthGuard } from '../auth/auth.guard';
import { TenantInterceptor } from 'src/app/tenant/middleware/tenant.interceptor';
import { InvestmentDetailsDto } from '../investment/dto/detail-investment.dto';
import { CreateInvestmentDto } from '../investment/dto/create-investment.dto';
import { CreateWithdrawalDto } from '../withdrawal/dto/create-withdrawal.dto';
import { WithdrawalService } from '../withdrawal/withdrawal.service';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('view')
export class ViewController {
    constructor(
        private readonly investmentService: InvestmentService,
        private readonly authService: AuthService,
        private readonly withdrawalService: WithdrawalService,
        private readonly userService: UsersService
    ) { }

    @ApiExcludeEndpoint()
    @Get('')
    @Render('login')
    showLoginPage(@Query('error') error: string) {
        return { error };
    }

    @ApiExcludeEndpoint()
    @Post('login')
    @HttpCode(HttpStatus.OK)
    async handleLogin(
        @Body() data: CreateAuthDto,
        @Req() req: any,
        @Res() res: Response,
    ) {
        try {
            const responseAuthDto = await this.authService.signIn(data);
            req.session.user = { token: responseAuthDto.token };
            return res.redirect('/view/investments');
        } catch (error) {
            return res.redirect('/view?error=Invalid credentials');
        }
    }

    @ApiExcludeEndpoint()
    @Get('create-user')
    @Render('create_user')
    showCreateUserForm() {
      return {};
    }

    @ApiExcludeEndpoint()
    @Post('create-user')
    async createUser(
      @Body() createUserDto: CreateUserDto,
      @Req() req: Request,
      @Res() res: Response,
    ): Promise<void> {
      try {
        await this.userService.create(createUserDto);
        return res.redirect('/view/');
      } catch (error) {
        return res.render('create_user', {
          error: 'Não foi possível criar o usuário. Verifique os dados e tente novamente.',
          username: createUserDto.username,
        });
      }
    }

    @ApiExcludeEndpoint()
    @Get('investments/new')
    @UseGuards(AuthGuard)
    @UseInterceptors(TenantInterceptor)
    @Render('create_investment')
    createInvestmentPage(@Req() req: any, @Res() res: Response,) {
        if (!req.session.user?.token) {

            return res.redirect('/view/login?error=Invalid credentials');
        }
        return {};
    }

    @ApiExcludeEndpoint()
    @Post('investments/new')
    @UseGuards(AuthGuard)
    @UseInterceptors(TenantInterceptor)
    async createInvestment(
        @Body() createInvestmentDto: CreateInvestmentDto,
        @Req() req: any,
        @Res() res: Response,
    ): Promise<void> {
        if (!req.session.user?.token) {
            return res.redirect('/view/login?error=Invalid credentials');
        }
        
        try {
            await this.investmentService.create(createInvestmentDto);
            return res.redirect('/view/investments');
        } catch (error) {
            return res.render('create_investment', {
                error: 'Não foi possível criar o investimento. Verifique os dados e tente novamente.',
                initial_amount: createInvestmentDto.initial_amount,
                creation_date: createInvestmentDto.creation_date,
            });
        }
    }

    @ApiExcludeEndpoint()
    @Get('investments')
    @UseGuards(AuthGuard)
    @UseInterceptors(TenantInterceptor)
    @Render('index')
    async getInvestments(
        @Query() query: FindAllParameters,
        @Req() req: any,
        @Res() res: Response,
    ): Promise<void | { message: string; investments: ListInvestmentsDto & { currentPage: number, pageNumbers: number[] } }> {

        if (!req.session.user?.token) {
            return res.redirect('/view/login?error=Invalid credentials');
        }

        const page = +query.page || 1;
        const limit = +query.limit || 5;

        const data = await this.investmentService.findAll({ ...query, page, limit });

        const pageNumbers = Array.from({ length: data.totalPages }, (_, i) => i + 1);

        return {
            message: 'Lista de Investimentos',
            investments: {
                ...data,
                currentPage: page,
                pageNumbers,
            },
        };
    }

    @ApiExcludeEndpoint()
    @Get('investments/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(TenantInterceptor)
    @Render('details')
    async investmentDetail(
        @Param('id') id: string,
        @Req() req: any,
        @Res() res: Response,
    ): Promise<void | { message: string; investment: InvestmentDetailsDto }> {
        if (!req.session.user?.token) {
            return res.redirect('/view/login?error=Invalid credentials');
        }

        const investment = await this.investmentService.findOne(id);

        return {
            message: 'Detalhes do Investimento',
            investment,
        };
    }

    @ApiExcludeEndpoint()
    @Get('withdrawals/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(TenantInterceptor)
    @Render('withdrawals')
    createWithdrawalForm(@Req() req: any,@Param('id') id: string,) {
        if (!req.session.user?.token) {
            return { error: 'Você precisa estar autenticado para criar uma retirada.' };
        }
        return {id};
    }

    @ApiExcludeEndpoint()
    @Post('withdrawals/:id')
    @UseGuards(AuthGuard)
    @UseInterceptors(TenantInterceptor)
    async createWithdrawal(
        @Body() createWithdrawalDto: CreateWithdrawalDto,
        @Param('id') id: string,
        @Req() req: any,
        @Res() res: Response,
    ) {
        if (!req.session.user?.token) {
            return res.redirect('/view/login?error=Invalid credentials');
        }

        try {
            await this.withdrawalService.create(id, createWithdrawalDto);
            return res.redirect(`/view/investments/${id}`);
        } catch (error) {
            return res.render(`withdrawals/${id}`, {
                error: 'Não foi possível criar a retirada. Verifique os dados e tente novamente.',
                ...createWithdrawalDto,
            });
        }
    }
}

