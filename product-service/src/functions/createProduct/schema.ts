export default {
  type: "object",
  properties: {
		id: { type: "string", format: "uuid" },
		title: { type: "string", minLength: 1, maxLength: 255 },
		description: { type: "string", minLength: 1, maxLength: 255 },
		price: { type: "number", minimum: 0, exclusiveMinimum: true },
		count: { type: "integer", minimum: 0 },
	},
	required: ["id", "title", "description", "price", "count"],
} as const;
