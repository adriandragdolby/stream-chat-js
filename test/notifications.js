import chai from 'chai';
const expect = chai.expect;
import { getTestClient, getTestClientForUser, createUserToken, sleep } from './utils';
import uuidv4 from 'uuid/v4';

describe('Notifications - members not watching', function() {
	const serverSideClient = getTestClient(true);
	const thierryID = `thierry-${uuidv4()}`;
	const tommasoID = `tommaso-${uuidv4()}`;
	let thierryClient, tommasoClient;
	let thierryChannel, tommasoChannel;
	const cid = `c-${uuidv4()}`;
	const message = { text: 'nice little chat API' };
	const events = [];

	before(async () => {
		thierryClient = await getTestClientForUser(thierryID);
		tommasoClient = await getTestClientForUser(tommasoID);
	});

	it('thierry is added to a new channel', async function() {
		const memberNewReceived = new Promise(resolve => {
			thierryClient.on('notification.added_to_channel', e => {
				expect(e.channel).to.be.an('object');
				expect(e.channel.cid).to.eq(`messaging:${cid}`);
				resolve();
			});
		});

		await serverSideClient
			.channel('messaging', cid, {
				created_by: { id: tommasoID },
				members: [thierryID, tommasoID],
			})
			.create();

		await memberNewReceived;
	});

	it('tommaso sends a message on the new channel', async function() {
		tommasoChannel = tommasoClient.channel('messaging', cid);
		await tommasoChannel.watch();

		const messageNewReceived = new Promise(resolve => {
			thierryClient.on('notification.message_new', e => {
				expect(e.cid).to.eq(`messaging:${cid}`);
				expect(e.channel).to.be.an('object');
				expect(e.message).to.be.an('object');
				expect(e.message.user).to.be.an('object');
				expect(e.message.user.id).to.eq(tommasoID);
				expect(e.unread_count).to.eq(1);
				resolve();
			});
		});

		await tommasoChannel.sendMessage(message);
		await messageNewReceived;
	});

	it('thierry watches the new channel', async function() {
		thierryChannel = thierryClient.channel('messaging', cid);
		await thierryChannel.watch();
	});

	it('thierry does not get a notification message this time', async function() {
		await sleep(1000);
		expect(events).to.have.length(0);
	});

	it('tommaso sends another message', async function() {
		await tommasoChannel.sendMessage(message);
	});

	it('thierry marks the channel as read', async function() {
		thierryClient.on('notification.mark_read', e => {
			events.push(e);
		});
		await thierryChannel.markRead();
	});

	it('thierry gets a notification message with the unread count', async function() {
		await sleep(1000);
		expect(events).to.have.length(1);
		expect(events[0].type).to.eq('notification.mark_read');
		expect(events[0].unread_count).to.eq(0);
		events.pop();
	});
});

describe('Notifications - doing stuff on different tabs', function() {
	const serverSideClient = getTestClient(true);
	const message = { text: 'nice little chat API' };
	const thierryID = `thierry-${uuidv4()}`;
	const tommasoID = `tommaso-${uuidv4()}`;
	let tab1Client, tab2Client;
	const cid = `c-${uuidv4()}`;
	const tab1Events = [];
	const tab2Events = [];

	before(async () => {
		await getTestClientForUser(tommasoID);
	});

	it('tab1: init client for thierry', async function() {
		tab1Client = await getTestClientForUser(thierryID);
		tab1Client.on('message.new', e => {
			tab1Events.push(e);
		});
		tab1Client.on('notification.message_new', e => {
			tab1Events.push(e);
		});
	});

	it('tab2: init client for thierry', async function() {
		tab2Client = await getTestClientForUser(thierryID);
		tab2Client.on('message.new', e => {
			tab2Events.push(e);
		});
		tab2Client.on('notification.message_new', e => {
			tab2Events.push(e);
		});
	});

	it('create a new channel with thierry and tommaso', async function() {
		const tab1NotificationReceived = new Promise(resolve => {
			tab1Client.on('notification.added_to_channel', () => {
				resolve();
			});
		});

		const channel = serverSideClient.channel('messaging', cid, {
			created_by: { id: tommasoID },
		});

		await channel.create();
		await channel.addMembers([thierryID, tommasoID]);
		await tab1Client.channel('messaging', cid).watch();
		await tab1NotificationReceived;
	});

	it('tommaso sends a message on the new channel', async function() {
		const tommasoClient = await getTestClientForUser(tommasoID);
		const tommasoChannel = tommasoClient.channel('messaging', cid);
		await tommasoChannel.watch();
		await tommasoChannel.sendMessage(message);
	});

	it('tab1: should have a message.new event only', async function() {
		await sleep(1000);
		expect(tab1Events).to.have.length(1);
		expect(tab1Events[0].cid).to.eq(`messaging:${cid}`);
		expect(tab1Events[0].type).to.eq('message.new');
		expect(tab1Events[0].unread_count).to.eq(1);
	});

	it('tab2: should have a notification.message_new event only', async function() {
		await sleep(1000);
		expect(tab2Events).to.have.length(1);
		expect(tab2Events[0].cid).to.eq(`messaging:${cid}`);
		expect(tab2Events[0].type).to.eq('notification.message_new');
	});
});

describe('Unread on connect', function() {
	const serverSideClient = getTestClient(true);
	const cids = [uuidv4(), uuidv4(), uuidv4(), uuidv4(), uuidv4()];
	const tommasoID = `tommaso-${uuidv4()}`;
	const thierryID = `thierry-${uuidv4()}`;
	let thierryClient;

	before(async () => {
		await serverSideClient.updateUser({ id: tommasoID });
		await serverSideClient.updateUser({ id: thierryID });

		for (let i = 0; i < 5; i++) {
			await serverSideClient
				.channel('messaging', cids[i], {
					created_by: { id: tommasoID },
				})
				.create();
			await serverSideClient
				.channel('livestream', cids[i], {
					created_by: { id: tommasoID },
				})
				.create();
		}
	});

	it('add 1 message to 5 messaging channels', async function() {
		const p = [];
		for (let i = 0; i < 5; i++) {
			p.push(
				serverSideClient
					.channel('messaging', cids[i])
					.sendMessage({ text: uuidv4(), user: { id: tommasoID } }),
			);
		}
		await Promise.all(p);
	});

	it('add thierry to all channels', async function() {
		const p = [];
		for (let i = 0; i < 5; i++) {
			p.push(
				serverSideClient.channel('messaging', cids[i]).addMembers([thierryID]),
			);
			p.push(
				serverSideClient.channel('livestream', cids[i]).addMembers([thierryID]),
			);
		}
		await Promise.all(p);
	});

	it('add 1 message to 5 messaging channels', async function() {
		for (let i = 0; i < 5; i++) {
			await serverSideClient
				.channel('messaging', cids[i])
				.sendMessage({ text: uuidv4(), user: { id: tommasoID } });
		}
	});

	it('add 1 message to 5 livestream channels', async function() {
		for (let i = 0; i < 5; i++) {
			await serverSideClient
				.channel('livestream', cids[i])
				.sendMessage({ text: uuidv4(), user: { id: tommasoID } });
		}
	});

	it('thierry connects and receives unread_count=5', async function() {
		thierryClient = getTestClient(false);
		const response = await thierryClient.setUser(
			{ id: thierryID },
			createUserToken(thierryID),
		);
		expect(response.own_user.unread_count).to.eq(5);
	});

	it('thierry marks one messaging channel as read', async function() {
		const chan = thierryClient.channel('messaging', cids[1]);
		await chan.watch();
		await chan.markRead();
	});

	it('thierry re-connects and receive unread_count=4', async function() {
		thierryClient = getTestClient(false);
		const response = await thierryClient.setUser(
			{ id: thierryID },
			createUserToken(thierryID),
		);
		expect(response.own_user.unread_count).to.eq(4);
	});

	it('insert 100 messages to messaging:chatty', async function() {
		for (let j = 0; j < 10; j++) {
			const p = [];
			for (let i = 0; i < 10; i++) {
				p.push(
					serverSideClient
						.channel('messaging', cids[2])
						.sendMessage({ text: uuidv4(), user: { id: tommasoID } }),
				);
			}
			await Promise.all(p);
		}
	});

	it('thierry re-connects and receives unread_count=100', async function() {
		thierryClient = getTestClient(false);
		const response = await thierryClient.setUser(
			{ id: thierryID },
			createUserToken(thierryID),
		);
		expect(response.own_user.unread_count).to.eq(100);
	});

	it('thierry marks messaging:chatty as read', async function() {
		const chan = thierryClient.channel('messaging', cids[2]);
		await chan.watch();
		const receivedEvent = new Promise(resolve => {
			const subscription = thierryClient.on('notification.mark_read', e => {
				expect(e.unread_count).to.eq(3);
				subscription.unsubscribe();
				resolve();
			});
		});
		await chan.markRead();
		await receivedEvent;
	});

	it('thierry re-connects and receives unread_count=3', async function() {
		thierryClient = getTestClient(false);
		const response = await thierryClient.setUser(
			{ id: thierryID },
			createUserToken(thierryID),
		);
		expect(response.own_user.unread_count).to.eq(3);
	});

	it('thierry is removed from the channel and gets notified about it', async function() {
		const readChangeReceived = new Promise(resolve => {
			const subscription = thierryClient.on('notification.mark_read', e => {
				expect(e.unread_count).to.eq(2);
				subscription.unsubscribe();
				resolve();
			});
		});

		const memberDeletedReceived = new Promise(resolve => {
			thierryClient.on('notification.removed_from_channel', e => {
				expect(e.channel).to.be.an('object');
				expect(e.channel.cid).to.eq(`messaging:${cids[3]}`);
				resolve();
			});
		});

		await serverSideClient
			.channel('messaging', cids[3])
			.removeMembers([thierryID, tommasoID]);
		await memberDeletedReceived;
		await readChangeReceived;
	});
});
