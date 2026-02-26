import { NextResponse } from 'next/server';

// Tana Toraja coordinates
const TORAJA_LAT = -3.0747;
const TORAJA_LON = 119.8654;

interface WeatherData {
    temperature: number;
    condition: string;
    conditionCode: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    feelsLike: number;
    precipitation: number;
    cloudCover: number;
    visibility: number;
    pressure: number;
    uvIndex: number;
    isDay: boolean;
    lastUpdated: string;
    location: string;
}

interface ForecastDay {
    date: string;
    dayName: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    conditionCode: number;
    precipitation: number;
    precipitationProbability: number;
}

// Map WMO weather codes to conditions
function getWeatherCondition(code: number): string {
    const weatherConditions: Record<number, string> = {
        0: 'Clear sky',
        1: 'Mainly clear',
        2: 'Partly cloudy',
        3: 'Overcast',
        45: 'Foggy',
        48: 'Depositing rime fog',
        51: 'Light drizzle',
        53: 'Moderate drizzle',
        55: 'Dense drizzle',
        56: 'Light freezing drizzle',
        57: 'Dense freezing drizzle',
        61: 'Slight rain',
        63: 'Moderate rain',
        65: 'Heavy rain',
        66: 'Light freezing rain',
        67: 'Heavy freezing rain',
        71: 'Slight snow',
        73: 'Moderate snow',
        75: 'Heavy snow',
        77: 'Snow grains',
        80: 'Slight rain showers',
        81: 'Moderate rain showers',
        82: 'Violent rain showers',
        85: 'Slight snow showers',
        86: 'Heavy snow showers',
        95: 'Thunderstorm',
        96: 'Thunderstorm with slight hail',
        99: 'Thunderstorm with heavy hail',
    };
    return weatherConditions[code] || 'Unknown';
}

// Get day name from date
function getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
}

export async function GET() {
    try {
        // Fetch current weather from Open-Meteo API (free, no API key required)
        const currentWeatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${TORAJA_LAT}&longitude=${TORAJA_LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,cloud_cover,pressure_msl,wind_speed_10m,wind_direction_10m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FMakassar&forecast_days=7`;

        const response = await fetch(currentWeatherUrl, {
            next: { revalidate: 1800 }, // Cache for 30 minutes
        });

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();

        // Parse current weather
        const current = data.current;
        const daily = data.daily;

        const weatherData: WeatherData = {
            temperature: Math.round(current.temperature_2m),
            condition: getWeatherCondition(current.weather_code),
            conditionCode: current.weather_code,
            humidity: current.relative_humidity_2m,
            windSpeed: Math.round(current.wind_speed_10m),
            windDirection: current.wind_direction_10m,
            feelsLike: Math.round(current.apparent_temperature),
            precipitation: current.precipitation,
            cloudCover: current.cloud_cover,
            visibility: 10, // Open-Meteo doesn't provide visibility
            pressure: Math.round(current.pressure_msl),
            uvIndex: 0, // Open-Meteo requires separate call for UV
            isDay: current.is_day === 1,
            lastUpdated: new Date().toISOString(),
            location: 'Tana Toraja, South Sulawesi',
        };

        // Parse 7-day forecast
        const forecast: ForecastDay[] = daily.time.slice(0, 7).map((date: string, index: number) => ({
            date,
            dayName: getDayName(date),
            tempMax: Math.round(daily.temperature_2m_max[index]),
            tempMin: Math.round(daily.temperature_2m_min[index]),
            condition: getWeatherCondition(daily.weather_code[index]),
            conditionCode: daily.weather_code[index],
            precipitation: daily.precipitation_sum[index],
            precipitationProbability: daily.precipitation_probability_max[index] || 0,
        }));

        return NextResponse.json({
            success: true,
            data: {
                current: weatherData,
                forecast,
            },
        });
    } catch (error) {
        console.error('Error fetching weather:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to fetch weather data',
                // Return fallback data
                data: {
                    current: {
                        temperature: 24,
                        condition: 'Partly cloudy',
                        conditionCode: 2,
                        humidity: 75,
                        windSpeed: 12,
                        windDirection: 180,
                        feelsLike: 25,
                        precipitation: 0,
                        cloudCover: 50,
                        visibility: 10,
                        pressure: 1013,
                        uvIndex: 5,
                        isDay: true,
                        lastUpdated: new Date().toISOString(),
                        location: 'Tana Toraja, South Sulawesi',
                    },
                    forecast: [],
                }
            },
            { status: 200 } // Return 200 with fallback data
        );
    }
}
