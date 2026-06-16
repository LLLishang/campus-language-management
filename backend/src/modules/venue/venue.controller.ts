import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { VenueService } from './venue.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('venue')
@UseGuards(JwtAuthGuard)
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Get()
  findAll(@Query('category') category?: string, @Query('keyword') keyword?: string) {
    return this.venueService.findAll(category, keyword);
  }

  @Get('bookings/all')
  getAllBookings() {
    return this.venueService.getAllBookings();
  }

  @Get('bookings')
  getMyBookings(@CurrentUser('sub') userId: number) {
    return this.venueService.getMyBookings(userId);
  }

  @Get('bookings/:id')
  getBookingById(@Param('id') id: number) {
    return this.venueService.getBookingById(id);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.venueService.findOne(id);
  }

  @Get(':id/availability')
  getAvailability(@Param('id') id: number, @Query('date') date: string) {
    return this.venueService.getAvailability(id, date);
  }

  @Post(':id/book')
  book(
    @Param('id') venueId: number,
    @CurrentUser('sub') userId: number,
    @Body() dto: { bookingDate: string; startPeriod: number; endPeriod: number; purpose: string; attendeeCount?: number },
  ) {
    return this.venueService.book(userId, { ...dto, venueId });
  }

  @Delete('bookings/:id')
  cancelBooking(@Param('id') id: number, @CurrentUser('sub') userId: number) {
    return this.venueService.cancelBooking(id, userId);
  }
}
