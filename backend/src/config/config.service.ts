import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
  get(key: string, defaultValue?: string): string {
    return process.env[key] || defaultValue || '';
  }

  getNumber(key: string, defaultValue?: number): number {
    const val = process.env[key];
    return val ? parseInt(val) : defaultValue || 0;
  }
}
