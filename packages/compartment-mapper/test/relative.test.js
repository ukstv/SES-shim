// Derrived from https://github.com/junosuarez/url-relative
//
// Copyright (c) MMXV jden jason@denizac.org
//
// ISC License
//
// Permission to use, copy, modify, and/or distribute this software for any
// purpose with or without fee is hereby granted, provided that the above
// copyright notice and this permission notice appear in all copies.
//
// THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
// WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
// MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY
// SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
// WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION
// OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN
// CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.

import tape from "tape";
import { relative } from "../src/url.js";

const { test } = tape;

test("different protocol", t => {
  t.plan(2);
  t.equal(
    relative("http://a.com:12/a", "https://a.com:12/a"),
    "https://a.com:12/a"
  );
  t.equal(
    relative("http://a.com:12/a/", "https://a.com:12/a/"),
    "https://a.com:12/a/"
  );
});

test("file protocol", t => {
  t.plan(1);
  t.equal(relative("file:///a", "file:///b"), "b");
});

test("different domain", t => {
  t.plan(2);
  t.equal(relative("http://a.com:12/a", "http://b.com/a"), "http://b.com/a");
  t.equal(relative("http://a.com:12/a/", "http://b.com/a/"), "http://b.com/a/");
});

test("same domain", t => {
  t.plan(2);
  t.equal(relative("http://a.com/a", "http://a.com/b"), "b");
  t.equal(relative("http://a.com/a/", "http://a.com/b/"), "../b/");
});

test("divergent paths, longer from", t => {
  t.plan(4);
  t.equal(
    relative("http://example.com/a/b/c/d", "http://example.com/a/b/d"),
    "../d"
  );
  t.equal(
    relative("http://example.com/a/b/c/d/e", "http://example.com/a/d/e"),
    "../../d/e"
  );
  t.equal(
    relative("http://example.com/a/b/c/d/", "http://example.com/a/b/d/"),
    "../../d/"
  );
  t.equal(
    relative("http://example.com/a/b/c/d/e/", "http://example.com/a/d/e/"),
    "../../../d/e/"
  );
});

test("divergent paths, longer to", t => {
  t.plan(6);
  t.equal(
    relative("http://example.com/a/b/c/d", "http://example.com/a/b/c/d/e"),
    "e"
  );
  t.equal(
    relative("http://example.com/a/b/c/d", "http://example.com/a/b/c/d/e/f"),
    "e/f"
  );
  t.equal(relative("http://example.com/", "http://example.com/a/b"), "a/b");
  t.equal(
    relative("http://example.com/a/b/c/d/", "http://example.com/a/b/c/d/e/"),
    "e/"
  );
  t.equal(
    relative("http://example.com/a/b/c/d/", "http://example.com/a/b/c/d/e/f/"),
    "e/f/"
  );
  t.equal(relative("http://example.com/", "http://example.com/a/b/"), "a/b/");
});

test("divergent paths, equal length", t => {
  t.plan(2);
  t.equal(
    relative(
      "http://example.com/a/b/c/d/e/f",
      "http://example.com/a/b/c/g/h/j"
    ),
    "../../g/h/j"
  );
  t.equal(
    relative(
      "http://example.com/a/b/c/d/e/f/",
      "http://example.com/a/b/c/g/h/j/"
    ),
    "../../../g/h/j/"
  );
});

test("identical", t => {
  t.plan(2);
  t.equal(relative("https://a.com/a", "https://a.com/a"), "");
  t.equal(relative("https://a.com/a/", "https://a.com/a/"), "");
});
