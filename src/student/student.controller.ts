import { Controller, Get } from '@nestjs/common';

@Controller('student')
export class StudentController {

    //for testing purpose only
    @Get()
    UserRoute() {
        return 'Student Route is active now'
    }
}
