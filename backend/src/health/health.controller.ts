import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ApiOk } from '../common/decorators/api-docs.decorator';
import { Public } from '../common/decorators/public.decorator';
import { getMessage } from '../common/messages';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  @ApiOk('Health check', 'Service is up')
  health() {
    return { status: 'ok', message: getMessage('HEALTH_OK') };
  }
}
