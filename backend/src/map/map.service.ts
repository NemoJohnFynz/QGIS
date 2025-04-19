import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MapService {
  private readonly allowedProfiles = ['driving', 'walking', 'cycling'];

  async getDirections(origin: number[], destination: number[], profile: string = 'driving') {
    if (!this.allowedProfiles.includes(profile)) {
      console.warn(`Invalid profile "${profile}" provided. Falling back to "driving".`);
      profile = 'driving';
    }

    const baseUrl = `https://api.mapbox.com/directions/v5/mapbox/${profile}`;
    const coordinates = `${origin[0]},${origin[1]};${destination[0]},${destination[1]}`;
    const url = `${baseUrl}/${coordinates}?geometries=geojson&access_token=${process.env.MAPBOX_TOKEN}`;

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('Mapbox error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch directions from Mapbox');
    }
  }
}
