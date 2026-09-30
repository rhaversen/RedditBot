import snoowrap from "snoowrap";

// Contract
// Inputs: env vars USERNAME, PASSWORD, CLIENT_ID, CLIENT_SECRET
// Behavior: acquires token, prints identity, and posts a text update to user's own profile (u_<USERNAME>)
// Errors: exits non-zero with concise error message

function requireEnv(name: string): string {
	const v = process.env[name];
	if (!v) throw new Error(`Missing required env: ${name}`);
	return v;
}

async function createClient(params: {
	clientId: string;
	clientSecret: string;
	username: string;
	password: string;
	userAgent: string;
}): Promise<any> {
	const r = new (snoowrap as any)({
		userAgent: params.userAgent,
		clientId: params.clientId,
		clientSecret: params.clientSecret,
		username: params.username,
		password: params.password,
	});
	return r;
}

async function main() {
	try {
		const username = requireEnv("USERNAME");
		const password = requireEnv("PASSWORD");
		const clientId = requireEnv("CLIENT_ID");
		const clientSecret = requireEnv("CLIENT_SECRET");
		const userAgent = `RedditBotTS/0.1 by ${username}`;

		const r = await createClient({ clientId, clientSecret, username, password, userAgent });

	const me = r.getMe();
	const meName: string = await me.name;
		console.log(`Authenticated as ${meName}`);

	const submission = await r.submitSelfpost({
			subredditName: `u_${username}`,
			title: "Hello from a TS bot",
			text: "This is a test post to my profile via Reddit API.",
		});
	const url: string = await submission.url;
		console.log(`Posted to profile: ${url}`);
	} catch (err: any) {
		console.error(err.message || err);
		process.exitCode = 1;
	}
}

main();
