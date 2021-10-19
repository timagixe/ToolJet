import { Controller, Request, Req, Post, Body, Get, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ThreadService } from '../services/thread.service';
import { CreateThreadDTO } from '../dto/create-thread.dto';
import { Thread } from '../entities/thread.entity';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@Controller('threads')
export class ThreadController {
  constructor(private threadService: ThreadService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  public async createThread(@Request() req, @Body() createThreadDto: CreateThreadDTO): Promise<Thread> {
    const thread = await this.threadService.createThread(createThreadDto, req.user.id, req.user.organization.id);
    return thread;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:appId/all')
  public async getThreads(@Request() req, @Param('appId') appId: string): Promise<Thread[]> {
    const threads = await this.threadService.getThreads(appId, req.user.organization.id);
    return threads;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:orgId/all')
  public async getOrganizationThreads(@Param('orgId') orgId: string, @Req() req: Request): Promise<Thread[]> {
    const threads = await this.threadService.getOrganizationThreads(orgId);
    return threads;
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:threadId')
  public async getThread(@Param('threadId') threadId: number) {
    const thread = await this.threadService.getThread(threadId);
    return thread;
  }

  @UseGuards(JwtAuthGuard)
  @Patch('/edit/:threadId')
  public async editThread(
    @Body() createThreadDto: CreateThreadDTO,
    @Param('threadId') threadId: number
  ): Promise<Thread> {
    const thread = await this.threadService.editThread(threadId, createThreadDto);
    return thread;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/delete/:threadId')
  public async deleteThread(@Param('threadId') threadId: number) {
    const deletedThread = await this.threadService.deleteThread(threadId);
    return deletedThread;
  }
}
