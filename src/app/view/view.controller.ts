import { Controller, Get, Render } from '@nestjs/common';

@Controller('view')
export class ViewController {
    @Get()
    @Render("index")
    home(){
        return {message: "ola"}
    }
}
