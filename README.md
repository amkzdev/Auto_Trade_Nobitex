## :beginner: About Project

Welcome to the Auto Trading Script, a robust solution designed to leverage real-time cryptocurrency market data for automated trading. This TypeScript-based script continuously analyzes market conditions and executes trades based on pre-defined strategies. With the ability to send notifications via SMS and Social Media Messanger, you’ll never miss a crucial update related to your trading activities.


## :hammer_and_wrench: Technologies And Languages

* **TypeScript**:For structured and scalable code
* **Axios**: For making API requests


## :satellite: Used APIs

* **Nobitex Exchange API**: Fetches live market data and allows trade execution.
* **Social Media API (Bale)**: Sends real-time notifications to your messager channel
* **SMS Services API (Kavenegar)** : Sends SMS alerts when a trade is executed
 

 ## 	:sparkles: Features
* Automated Trading: Executes buy/sell trades based on your defined strategy. <br/>
* Real-time Notifications: Stay updated with SMS and Telegram notifications for every trade executed.<br/>
* User-Friendly Configuration: Simple environmental setup to get started.<br/>

 ## 	:runner: Getting Started

Follow these simple steps to set up and run the Auto Trading Script:

 **1-Configuration**: Create a .env file in the root directory and populate it with the following environment variables:

```bash
 NOBITEX_API = XXXXXXXXXXXX
 KAVEH_API = XXXXXXXXXX
 BALE_BOT_TOKEN = XXXXXXXX
 TRADING = 1  
```
 TRADING = 1 => Enables automated trading<br/>
 TRADING = 0 => Disables automated trading 

**2-Running the Script**: Start the development server by executing the following command in your terminal:

```bash
node index
```
You can start editing the script by modifying `index.ts`. 

**3-Customization**: Feel free to delve into the index.ts file to modify and enhance the trading strategy according to your preferences.


# :clipboard: Future Enhancements
We aim to continually improve this script. Future updates may include:

* Expanded trading strategies. 
* Support for additional cryptocurrency exchanges.
* Enhanced error handling and logging capabilities.




If you have any questions, suggestions, or contributions, feel free to reach out! </br>
**Happy Trading!** 🚀
