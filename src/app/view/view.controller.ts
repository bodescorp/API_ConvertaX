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
import { TenantInterceptor } from 'src/tenant/middleware/tenant.interceptor';
import { InvestmentDetailsDto } from '../investment/dto/detail-investment.dto';

@Controller('view')
export class ViewController {
    constructor(
        private readonly investmentService: InvestmentService,
        private readonly authService: AuthService,
    ) { }

    @Get('login')
    @Render('login')
    showLoginPage(@Query('error') error: string) {
        return { error };
    }

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
            return res.redirect('/view/login?error=Invalid credentials');
        }
    }


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
}
