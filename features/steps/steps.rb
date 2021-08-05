Then("the Content-Type header is valid multipart form-data") do
  expected = /^multipart\/form-data; boundary=--------------------------\d+$/
  actual = Maze::Server.sourcemaps.current[:request]["content-type"]

  assert_match(expected, actual)
end

Then("the Content-Type header is valid multipart form-data for all requests") do
  Maze::Server.sourcemaps.all.each do |request|
    expected = /^multipart\/form-data; boundary=--------------------------\d+$/
    actual = request[:request]["content-type"]

    assert_match(expected, actual)
  end
end

def read_expected_file(fixture, file_name)
  path = "#{__dir__}/../expected/#{fixture}/#{file_name}"

  assert_true(File.exists?(path), "The file '#{file_name}' does not exist at '#{path}'")

  File.read(path)
end

def get_form_data_as_string(field, request = Maze::Server.sourcemaps.current)
  form_data = Maze::Helper.read_key_path(request[:body], field)

  assert_instance_of(
    WEBrick::HTTPUtils::FormData,
    form_data,
    "Expected the payload value for '#{field}' to be an instance of 'WEBrick::HTTPUtils::FormData' but it was a '#{form_data.class}'"
  )

  form_data.to_s.force_encoding('UTF-8')
end

def assert_source_map_matches(field, file_name, fixture, request = Maze::Server.sourcemaps.current)
  expected = JSON.parse(read_expected_file(fixture, file_name))
  actual = JSON.parse(get_form_data_as_string(field, request))

  assert_equal(expected, actual)
end

Then("the sourcemap payload field {string} matches the expected source map for {string}") do |field, fixture|
  steps %Q{
    Then the sourcemap payload field "#{field}" matches the source map "source-map.json" for "#{fixture}"
  }
end

Then("the sourcemap payload field {string} matches the expected minified file for {string}") do |field, fixture|
  steps %Q{
    Then the sourcemap payload field "#{field}" matches the minified file "minified-file.js" for "#{fixture}"
  }
end

Then("the sourcemap payload field {string} matches the expected bundle for {string}") do |field, fixture|
  steps %Q{
    Then the sourcemap payload field "#{field}" matches the minified file "bundle.js" for "#{fixture}"
  }
end

Then("the sourcemap payload field {string} matches the source map {string} for {string}") do |field, file_name, fixture|
  assert_source_map_matches(field, file_name, fixture)
end

Then("the sourcemap payload field {string} matches the minified file {string} for {string}") do |field, file_name, fixture|
  expected = read_expected_file(fixture, file_name).chomp
  actual = get_form_data_as_string(field)

  assert_equal(expected, actual)
end

Then("the sourcemap payload field {string} equals {string} for all requests") do |field, expected|
  Maze::Server.sourcemaps.all.each_with_index do |request, index|
    actual = Maze::Helper.read_key_path(request[:body], field)

    assert_equal(
      expected,
      actual,
      "Request ##{index + 1} had an unexpected value for '#{field}'. Expected '#{expected}' but got '#{actual}'"
    )
  end
end

Then("the sourcemap payload field {string} is null for all requests") do |field|
  Maze::Server.sourcemaps.all.each_with_index do |request, index|
    actual = Maze::Helper.read_key_path(request[:body], field)

    assert_nil(
      actual,
      "Request ##{index + 1} had an unexpected value for '#{field}'. Expected null but got '#{actual}'"
    )
  end
end

Then("the sourcemap payload field {string} matches the expected source map for {string} for all requests") do |field, fixture|
  steps %Q{
    Then the sourcemap payload field "#{field}" matches the source map "source-map.json" for "#{fixture}" for all requests
  }
end

Then("the sourcemap payload field {string} matches the expected minified file for {string} for all requests") do |field, fixture|
  steps %Q{
    Then the sourcemap payload field "#{field}" matches the minified file "minified-file.js" for "#{fixture}" for all requests
  }
end

Then("the sourcemap payload field {string} matches the expected bundle for {string} for all requests") do |field, fixture|
  steps %Q{
    Then the sourcemap payload field "#{field}" matches the minified file "bundle.js" for "#{fixture}" for all requests
  }
end

Then("the sourcemap payload field {string} matches the source map {string} for {string} for all requests") do |field, file_name, fixture|
  Maze::Server.sourcemaps.all.each do |request|
    assert_source_map_matches(field, file_name, fixture, request)
  end
end

Then("the sourcemap payload field {string} matches the minified file {string} for {string} for all requests") do |field, file_name, fixture|
  Maze::Server.sourcemaps.all.each do |request|
    expected = read_expected_file(fixture, file_name).chomp
    actual = get_form_data_as_string(field, request)

    assert_equal(expected, actual)
  end
end

# This is useful for debugging React Native because the source maps & bundles
# are too big to for MR to display, even in debug mode
counts = Hash.new(0)
Then("I write the sourcemap payload field {string} to disk") do |field|
  counts[field] += 1

  File.open("#{__dir__}/actual-#{field}-#{counts[field]}", "w") do |file|
    file.puts(get_form_data_as_string(field))
  end
end
