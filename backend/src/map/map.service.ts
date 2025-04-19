import { Injectable, BadRequestException } from '@nestjs/common';
import axios from 'axios';
import { EventGeteWay } from 'src/event/event.gateway';

@Injectable()
export class MapService {

  private readonly allowedProfiles = ['driving', 'walking', 'cycling'];

  constructor
  (
    private readonly EventGeteWay: EventGeteWay
    ){}

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
      const directions = response.data;

      // Phát sóng các bước chỉ đường và gửi từng thông tin về vị trí cho client
      // Giả sử bạn có một cách để theo dõi vị trí của user và phát sóng theo từng bước
      const steps = directions.routes[0].legs[0].steps;

      // Phát sóng thông tin vị trí và bước chỉ đường
      this.sendPositionUpdate(steps, origin, destination);

      return directions;
    } catch (error) {
      console.error('Mapbox error:', error.response?.data || error.message);
      throw new BadRequestException('Failed to fetch directions from Mapbox');
    }
  }

  private sendPositionUpdate(steps: any[], origin: number[], destination: number[]) {
    // Giả sử bạn có logic tính toán để xác định các bước tiếp theo và phát sóng mỗi bước
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];

      // Lấy thông tin từ các bước chỉ đường và truyền lên WebSocket
      const positionUpdate = {
        step: step.maneuver,
        coordinates: [origin[0], origin[1]], // Đây là vị trí của người dùng, có thể thay đổi theo mỗi bước
        stepDescription: step.instructions,
      };

      // Gửi dữ liệu tới WebSocket cho người dùng
      this.EventGeteWay.server.emit('userPositionUpdate', positionUpdate);
    }
  }
}

