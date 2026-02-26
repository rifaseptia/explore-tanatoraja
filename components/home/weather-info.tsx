'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { motion } from 'framer-motion';
import {
    Cloud, Droplets, Wind, Sun, Calendar, RefreshCw,
    CloudRain, CloudSun, CloudFog, CloudSnow, CloudLightning,
    Thermometer, Eye, Gauge, Navigation, Clock
} from 'lucide-react';

// Weather condition icons mapping
function getWeatherIcon(code: number, isDay: boolean = true) {
    // WMO weather codes
    if (code === 0) return Sun; // Clear sky
    if (code === 1 || code === 2) return CloudSun; // Mainly clear / Partly cloudy
    if (code === 3) return Cloud; // Overcast
    if (code >= 45 && code <= 48) return CloudFog; // Fog
    if (code >= 51 && code <= 67) return CloudRain; // Rain/Drizzle
    if (code >= 71 && code <= 77) return CloudSnow; // Snow
    if (code >= 80 && code <= 82) return CloudRain; // Rain showers
    if (code >= 85 && code <= 86) return CloudSnow; // Snow showers
    if (code >= 95 && code <= 99) return CloudLightning; // Thunderstorm
    return CloudSun; // Default
}

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

interface WeatherResponse {
    success: boolean;
    data: {
        current: WeatherData;
        forecast: ForecastDay[];
    };
    error?: string;
}

// Wind direction to arrow
function getWindDirectionArrow(degrees: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degrees / 45) % 8;
    return directions[index];
}

// Format time
function formatTime(isoString: string, locale: string): string {
    const date = new Date(isoString);
    return date.toLocaleTimeString(locale === 'id' ? 'id-ID' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export default function WeatherInfo() {
    const t = useTranslations('weather');
    const locale = useLocale() as 'id' | 'en';
    const [weather, setWeather] = useState<WeatherResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchWeather = useCallback(async () => {
        try {
            const response = await fetch('/api/weather');
            const data = await response.json();
            setWeather(data);
        } catch (error) {
            console.error('Error fetching weather:', error);
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchWeather();
    }, [fetchWeather]);

    const handleRefresh = () => {
        setIsRefreshing(true);
        fetchWeather();
    };

    if (isLoading) {
        return (
            <section className="py-10 bg-light">
                <div className="max-w-7xl mx-auto px-[38px]">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                        <div className="bg-white rounded-xl border border-gray-200 p-8 animate-pulse">
                            <div className="h-8 bg-gray/20 rounded w-1/2 mb-6"></div>
                            <div className="h-24 bg-gray/20 rounded mb-8"></div>
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="h-20 bg-gray/20 rounded"></div>
                                <div className="h-20 bg-gray/20 rounded"></div>
                            </div>
                            <div className="h-16 bg-gray/20 rounded"></div>
                        </div>
                        <div className="bg-dark rounded-xl p-8 animate-pulse border border-gray-700">
                            <div className="h-8 bg-white/20 rounded w-1/2 mb-6"></div>
                            <div className="h-24 bg-white/20 rounded mb-8"></div>
                            <div className="space-y-4">
                                <div className="h-16 bg-white/20 rounded"></div>
                                <div className="h-16 bg-white/20 rounded"></div>
                                <div className="h-16 bg-white/20 rounded"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    const current = weather?.data?.current;
    const forecast = weather?.data?.forecast || [];

    const WeatherIcon = current ? getWeatherIcon(current.conditionCode, current.isDay) : Sun;

    return (
        <section className="py-10 bg-light">
            <div className="max-w-7xl mx-auto px-[38px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Weather Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-xl border border-gray-200 p-8"
                    >
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-heading font-bold text-2xl text-dark">
                                {t('title')}
                            </h2>
                            <button
                                onClick={handleRefresh}
                                disabled={isRefreshing}
                                className="p-2 rounded-full hover:bg-gray/10 transition-colors disabled:opacity-50"
                                title={locale === 'id' ? 'Refresh data cuaca' : 'Refresh weather data'}
                            >
                                <RefreshCw className={`w-5 h-5 text-gray ${isRefreshing ? 'animate-spin' : ''}`} />
                            </button>
                        </div>

                        {/* Location & Last Updated */}
                        <div className="flex items-center gap-2 text-sm text-gray mb-4">
                            <Navigation className="w-4 h-4" />
                            <span>{current?.location || 'Tana Toraja'}</span>
                            {current?.lastUpdated && (
                                <>
                                    <span className="mx-2">•</span>
                                    <Clock className="w-4 h-4" />
                                    <span>{formatTime(current.lastUpdated, locale)}</span>
                                </>
                            )}
                        </div>

                        {/* Current Weather */}
                        <div className="flex items-center gap-6 mb-8">
                            <div className="w-20 h-20 bg-light rounded-full flex items-center justify-center">
                                <WeatherIcon className="w-12 h-12 text-dark" />
                            </div>
                            <div>
                                <div className="font-heading font-bold text-5xl text-dark">
                                    {current?.temperature ?? 24}°C
                                </div>
                                <p className="text-gray">{current?.condition || t('condition')}</p>
                                {current?.feelsLike && current.feelsLike !== current.temperature && (
                                    <p className="text-sm text-gray/60">
                                        {locale === 'id' ? `Terasa seperti ${current.feelsLike}°C` : `Feels like ${current.feelsLike}°C`}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Weather Details Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
                            <div className="bg-light rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray mb-1">
                                    <Droplets className="w-4 h-4" />
                                    <span className="text-xs">{t('humidity')}</span>
                                </div>
                                <p className="font-semibold text-dark">{current?.humidity ?? 75}%</p>
                            </div>
                            <div className="bg-light rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray mb-1">
                                    <Wind className="w-4 h-4" />
                                    <span className="text-xs">{t('wind')}</span>
                                </div>
                                <p className="font-semibold text-dark">{current?.windSpeed ?? 12} km/h</p>
                                {current?.windDirection && (
                                    <p className="text-xs text-gray/60">{getWindDirectionArrow(current.windDirection)}</p>
                                )}
                            </div>
                            <div className="bg-light rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray mb-1">
                                    <Gauge className="w-4 h-4" />
                                    <span className="text-xs">{locale === 'id' ? 'Tekanan' : 'Pressure'}</span>
                                </div>
                                <p className="font-semibold text-dark">{current?.pressure ?? 1013} hPa</p>
                            </div>
                            <div className="bg-light rounded-lg p-3">
                                <div className="flex items-center gap-2 text-gray mb-1">
                                    <Cloud className="w-4 h-4" />
                                    <span className="text-xs">{locale === 'id' ? 'Awan' : 'Clouds'}</span>
                                </div>
                                <p className="font-semibold text-dark">{current?.cloudCover ?? 50}%</p>
                            </div>
                        </div>

                        {/* 7-Day Forecast */}
                        {forecast.length > 0 && (
                            <div className="border-t border-gray/10 pt-6">
                                <h3 className="font-semibold text-dark mb-4">
                                    {locale === 'id' ? 'Prakiraan 7 Hari' : '7-Day Forecast'}
                                </h3>
                                <div className="grid grid-cols-7 gap-2">
                                    {forecast.map((day) => {
                                        const DayIcon = getWeatherIcon(day.conditionCode);
                                        return (
                                            <div key={day.date} className="text-center">
                                                <p className="text-gray text-xs mb-2">{day.dayName}</p>
                                                <DayIcon className="w-5 h-5 mx-auto text-dark mb-1" />
                                                <p className="font-semibold text-dark text-sm">{day.tempMax}°</p>
                                                <p className="text-gray text-xs">{day.tempMin}°</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </motion.div>

                    {/* Best Time to Visit */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-dark rounded-xl p-8 text-white border border-gray-700"
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <Calendar className="w-8 h-8" />
                            <h2 className="font-heading font-bold text-2xl">
                                {t('bestTime')}
                            </h2>
                        </div>

                        <p className="text-xl text-white/90 mb-8">
                            {t('bestTimeDesc')}
                        </p>

                        {/* Monthly Guide */}
                        <div className="space-y-4">
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{t('junSep')}</span>
                                    <span className="text-sm opacity-80">{t('junSepLabel')}</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div className="bg-white h-2 rounded-full" style={{ width: '90%' }} />
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{t('octDec')}</span>
                                    <span className="text-sm opacity-80">{t('octDecLabel')}</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div className="bg-white h-2 rounded-full" style={{ width: '75%' }} />
                                </div>
                            </div>
                            <div className="bg-white/10 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{t('janMay')}</span>
                                    <span className="text-sm opacity-80">{t('janMayLabel')}</span>
                                </div>
                                <div className="w-full bg-white/20 rounded-full h-2">
                                    <div className="bg-white h-2 rounded-full" style={{ width: '50%' }} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
