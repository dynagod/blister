export default (client) => {
    client.once('ready', async () => {
        console.log(`Logged in as ${client.user.tag}`);
      
        const commands = client.commands.map(command => command.data.toJSON());
        
        try {
            await client.application.commands.set(commands);
            console.log('Commands registered successfully!');
        } catch (error) {
            console.error('Error registering commands:', error);
        }
    });
};