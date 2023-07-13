import { greeting } from "@/greeting"

describe("greeting", () => {
  it("should return a greeting", () => {
    expect(greeting("John")).toBe("Hello John!")
  })

  it("should return a default greeting", () => {
    expect(greeting()).toBe("Hello World!")
  })
})
