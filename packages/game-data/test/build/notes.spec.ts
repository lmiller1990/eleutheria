import { describe, it } from "vitest"
import { generateNotes } from "../../scripts/generateNotes"

describe("build-notes", () => {
  it("generates note skins from scss", async () => {
    const result = await generateNotes()
    console.log(result)
  })
})