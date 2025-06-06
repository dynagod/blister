import axios from "axios";
import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from "discord.js";

const API_KEY = process.env.WEATHER_API_ID;
const BASE_URL = "http://api.openweathermap.org/data/2.5/weather";

export const data = new SlashCommandBuilder()
  .setName("weather")
  .setDescription("Get the current weather for a city")
  .addStringOption((option) =>
    option
      .setName("city")
      .setDescription("The city you want the weather for")
      .setRequired(true)
  );

export async function execute(interaction) {
  const city = interaction.options.getString("city");

  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
      },
    });

    const weatherData = response.data;

    const temp = weatherData.main.temp;
    const description = weatherData.weather[0].description;
    const humidity = weatherData.main.humidity;
    const windSpeed = weatherData.wind.speed;
    const cityName = weatherData.name;
    const country = weatherData.sys.country;
    const icon = weatherData.weather[0].icon;

    const embed = new EmbedBuilder()
      .setTitle(`Weather in ${cityName}, ${country}`)
      .setThumbnail(`https://openweathermap.org/img/wn/${icon}.png`)
      .setDescription(`**${description.charAt(0).toUpperCase() + description.slice(1)}**`)
      .addFields(
        { name: "Temperature", value: `${temp}°C`, inline: true },
        { name: "Humidity", value: `${humidity}%`, inline: true },
        { name: "Wind Speed", value: `${windSpeed} m/s`, inline: true }
      )
      .setColor("#00AAFF")
      .setFooter({ text: "Weather data from OpenWeatherMap" });

    await interaction.reply({ embeds: [embed] });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    await interaction.reply({
      content: "Sorry, I couldn't fetch the weather right now. Please try again later!",
      flags: [MessageFlags.Ephemeral],
    });
  }
}